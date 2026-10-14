import {
    ArrowLeft,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    GraduationCap,
    MapPin,
    RefreshCw,
    XCircle,
} from "lucide-react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import {
    getMyApplication,
} from "../../../api/applications";

import {
    getOpportunity,
} from "../../../api/opportunities";

import LoadingScreen from "../../../components/LoadingScreen";

import "./ApplicationDetails.css";
import "../../../components/student/StudentDetail.css";


/* =========================================================
   API HELPERS
========================================================= */

const getApiData = (response) => {
    return response?.data ?? response;
};


const getRelationValue = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "N/A";
    }

    if (typeof value === "object") {

        return (
            value.name ??
            value.title ??
            value.label ??
            value.value ??
            "N/A"
        );

    }

    return String(value);
};


/* =========================================================
   STATUS HELPERS
========================================================= */

const getStatusValue = (status) => {

    if (
        status === null ||
        status === undefined ||
        status === ""
    ) {
        return "pending";
    }

    if (typeof status === "object") {

        return String(
            status.value ??
            status.name ??
            status.label ??
            status.status ??
            "pending"
        ).toLowerCase();

    }

    return String(status).toLowerCase();
};


const getStatusLabel = (status) => {

    const value = getStatusValue(status);

    switch (value) {

        case "accepted":
            return "Accepted";

        case "approved":
            return "Approved";

        case "rejected":
            return "Rejected";

        case "withdrawn":
            return "Withdrawn";

        case "submitted":
            return "Submitted";

        case "under_review":
        case "under-review":
            return "Under Review";

        case "pending":
            return "Pending";

        default:
            return value
                .replace(/[_-]/g, " ")
                .replace(/\b\w/g, (letter) =>
                    letter.toUpperCase()
                );

    }

};


const getStatusClass = (status) => {

    const value = getStatusValue(status);

    if (
        value.includes("accept") ||
        value.includes("approv")
    ) {
        return "accepted";
    }

    if (
        value.includes("reject") ||
        value.includes("declin")
    ) {
        return "rejected";
    }

    if (
        value.includes("withdraw")
    ) {
        return "withdrawn";
    }

    return "pending";
};


const getStatusIcon = (status) => {

    const statusClass = getStatusClass(status);

    if (statusClass === "accepted") {
        return CheckCircle2;
    }

    if (statusClass === "rejected") {
        return XCircle;
    }

    return Clock3;
};


/* =========================================================
   DATE
========================================================= */

const formatDate = (date) => {

    if (!date) {
        return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "N/A";
    }

    return parsedDate.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );

};


/* =========================================================
   OPPORTUNITY HELPERS
========================================================= */

const getOpportunityTitle = (opportunity) => {

    return (
        opportunity?.title ??
        opportunity?.name ??
        opportunity?.opportunity_title ??
        "N/A"
    );

};


const getUniversityName = (opportunity) => {

    return getRelationValue(
        opportunity?.university ??
        opportunity?.university_name
    );

};


const getCountryName = (opportunity) => {

    return getRelationValue(
        opportunity?.country ??
        opportunity?.country_name ??
        opportunity?.university?.country
    );

};


const getTypeName = (opportunity) => {

    return getRelationValue(
        opportunity?.opportunity_type ??
        opportunity?.type ??
        opportunity?.opportunityType
    );

};


const getFundingName = (opportunity) => {

    return getRelationValue(
        opportunity?.funding_type ??
        opportunity?.funding ??
        opportunity?.fundingType
    );

};


const getDegreeName = (opportunity) => {

    return getRelationValue(
        opportunity?.degree ??
        opportunity?.degree_name
    );

};


const getFieldName = (opportunity) => {

    return getRelationValue(
        opportunity?.field ??
        opportunity?.field_name
    );

};


const getCityName = (opportunity) => {

    return (
        opportunity?.city ??
        opportunity?.university?.city ??
        "N/A"
    );

};


/* =========================================================
   COMPONENT
========================================================= */

function ApplicationDetails() {

    const { id } = useParams();

    const [application, setApplication] =
        useState(null);

    const [opportunity, setOpportunity] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =====================================================
       FETCH APPLICATION + OPPORTUNITY
    ===================================================== */

    const fetchApplicationDetails = async () => {

        try {

            setLoading(true);

            setError("");


            /* ---------------------------------------------
               Get Application
            --------------------------------------------- */

            const applicationResponse =
                await getMyApplication(id);

            const applicationData =
                getApiData(applicationResponse);


            if (!applicationData) {

                setApplication(null);

                setOpportunity(null);

                return;

            }


            setApplication(applicationData);


            /* ---------------------------------------------
               Get Opportunity
            --------------------------------------------- */

            const opportunityId =
                applicationData?.opportunity_id ??
                applicationData?.opportunity?.id;


            if (opportunityId) {

                try {

                    const opportunityResponse =
                        await getOpportunity(
                            opportunityId
                        );

                    const opportunityData =
                        getApiData(
                            opportunityResponse
                        );

                    setOpportunity(
                        opportunityData ?? null
                    );

                } catch (opportunityError) {

                    console.error(
                        "Failed to fetch opportunity details:",
                        opportunityError
                    );


                    /*
                     * If the application API already
                     * contains the opportunity relation,
                     * use it instead.
                     */

                    setOpportunity(
                        applicationData?.opportunity ??
                        null
                    );

                }

            } else {

                setOpportunity(
                    applicationData?.opportunity ??
                    null
                );

            }

        } catch (err) {

            console.error(
                "Failed to fetch application:",
                err
            );

            setError(
                err?.response?.data?.message ??
                "Failed to load application details."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       EFFECT
    ===================================================== */

    useEffect(() => {

        if (!id) {

            setError(
                "Application ID is missing."
            );

            setLoading(false);

            return;

        }

        fetchApplicationDetails();

    }, [id]);


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return <LoadingScreen />;

    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {

        return (

            <div className="application-details-page">

                <div className="application-details-error">

                    <div className="application-error-icon">

                        <XCircle size={24} />

                    </div>


                    <h2>
                        Unable to load application
                    </h2>


                    <p>
                        {error}
                    </p>


                    <div className="application-error-actions">

                        <button
                            type="button"
                            onClick={
                                fetchApplicationDetails
                            }
                            className="application-primary-button"
                        >

                            <RefreshCw size={15} />

                            Try Again

                        </button>


                        <Link
                            to="/student/applications"
                            className="application-back-button"
                        >

                            <ArrowLeft size={15} />

                            Back to Applications

                        </Link>

                    </div>

                </div>

            </div>

        );

    }


    /* =====================================================
       NOT FOUND
    ===================================================== */

    if (!application) {

        return (

            <div className="application-details-page">

                <div className="application-details-error">

                    <div className="application-error-icon">

                        <FileText size={24} />

                    </div>


                    <h2>
                        Application not found
                    </h2>


                    <p>
                        The requested application could not
                        be found.
                    </p>


                    <Link
                        to="/student/applications"
                        className="application-back-button"
                    >

                        <ArrowLeft size={15} />

                        Back to Applications

                    </Link>

                </div>

            </div>

        );

    }


    /* =====================================================
       CURRENT OPPORTUNITY
    ===================================================== */

    const currentOpportunity =
        opportunity ??
        application?.opportunity ??
        {};


    /* =====================================================
       DATA
    ===================================================== */

    const statusClass =
        getStatusClass(
            application?.status
        );


    const statusLabel =
        getStatusLabel(
            application?.status
        );


    const StatusIcon =
        getStatusIcon(
            application?.status
        );


    const opportunityId =
        currentOpportunity?.id ??
        application?.opportunity_id;


    const opportunityTitle =
        getOpportunityTitle(
            currentOpportunity
        );


    const universityName =
        getUniversityName(
            currentOpportunity
        );


    const countryName =
        getCountryName(
            currentOpportunity
        );


    const typeName =
        getTypeName(
            currentOpportunity
        );


    const fundingName =
        getFundingName(
            currentOpportunity
        );


    const degreeName =
        getDegreeName(
            currentOpportunity
        );


    const fieldName =
        getFieldName(
            currentOpportunity
        );


    const cityName =
        getCityName(
            currentOpportunity
        );


    const location =
        [
            cityName !== "N/A"
                ? cityName
                : "",
            countryName !== "N/A"
                ? countryName
                : "",
        ]
            .filter(Boolean)
            .join(", ") || "N/A";


    const submittedAt =
        application?.submitted_at ??
        application?.created_at ??
        application?.applied_at;


    const updatedAt =
        application?.updated_at ??
        application?.created_at;


    const studentName =
        application?.user?.name ??
        application?.student?.name ??
        application?.user_name ??
        application?.student_name ??
        "N/A";


    const studentEmail =
        application?.user?.email ??
        application?.student?.email ??
        application?.user_email ??
        application?.student_email ??
        "N/A";


    const notes =
        application?.notes ??
        application?.personal_statement ??
        application?.statement ??
        application?.cover_letter ??
        "";


    /* =====================================================
       STATUS DESCRIPTION
    ===================================================== */

    const getStatusDescription = () => {

        switch (statusClass) {

            case "accepted":
                return "Your application has been accepted.";

            case "rejected":
                return "Your application was not accepted.";

            case "withdrawn":
                return "This application has been withdrawn.";

            default:
                return "Your application is being reviewed.";

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="application-details-page">

            <div className="application-details-container">


                {/* =================================================
                   BREADCRUMB
                ================================================= */}

                {/* <div className="application-details-breadcrumb">

                    <Link to="/student/applications">

                        <ArrowLeft size={14} />

                        Applications

                    </Link>

                    <span>/</span>

                    <span>
                        Application #{application.id}
                    </span>

                </div> */}


                {/* =================================================
                   HEADER
                ================================================= */}

                <section className="application-details-header">

                    <div className="application-header-main">

                        <div className="application-header-icon">

                            <FileText size={24} />

                        </div>


                        <div className="application-header-content">

                            <span className="application-eyebrow">
                                APPLICATION #{application.id}
                            </span>


                            <h1>
                                {opportunityTitle}
                            </h1>


                            <div className="application-header-meta">

                                <span>

                                    <Building2 size={14} />

                                    {universityName}

                                </span>


                                {location !== "N/A" && (

                                    <span>

                                        <MapPin size={14} />

                                        {location}

                                    </span>

                                )}

                            </div>

                        </div>

                    </div>


                    <div
                        className={`application-status ${statusClass}`}
                    >

                        <StatusIcon size={15} />

                        {statusLabel}

                    </div>

                </section>


                {/* =================================================
                   OVERVIEW
                ================================================= */}

                <section className="application-overview-grid">


                    <div className="application-overview-card">

                        <Clock3 size={18} />

                        <div>

                            <span>
                                Status
                            </span>

                            <strong>
                                {statusLabel}
                            </strong>

                        </div>

                    </div>


                    <div className="application-overview-card">

                        <CalendarDays size={18} />

                        <div>

                            <span>
                                Submitted
                            </span>

                            <strong>
                                {formatDate(submittedAt)}
                            </strong>

                        </div>

                    </div>


                    <div className="application-overview-card">

                        <GraduationCap size={18} />

                        <div>

                            <span>
                                Degree
                            </span>

                            <strong>
                                {degreeName}
                            </strong>

                        </div>

                    </div>


                    <div className="application-overview-card">

                        <FileText size={18} />

                        <div>

                            <span>
                                Application ID
                            </span>

                            <strong>
                                #{application.id}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                   MAIN LAYOUT
                ================================================= */}

                <div className="application-details-layout">


                    {/* =================================================
                       MAIN CONTENT
                    ================================================= */}

                    <main className="application-details-content">


                        {/* =============================================
                           OPPORTUNITY
                        ============================================= */}

                        <section className="application-details-card">

                            <div className="application-section-heading">

                                <span>
                                    OPPORTUNITY
                                </span>

                                <h2>
                                    Opportunity information
                                </h2>

                            </div>


                            <div className="application-opportunity-highlight">

                                <div className="application-opportunity-icon">

                                    <GraduationCap size={22} />

                                </div>


                                <div>

                                    <span>
                                        Opportunity
                                    </span>

                                    <strong>
                                        {opportunityTitle}
                                    </strong>

                                </div>

                            </div>


                            <div className="application-info-grid">


                                <div>

                                    <span>
                                        University
                                    </span>

                                    <strong>
                                        {universityName}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Country
                                    </span>

                                    <strong>
                                        {countryName}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Type
                                    </span>

                                    <strong>
                                        {typeName}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Funding
                                    </span>

                                    <strong>
                                        {fundingName}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Degree
                                    </span>

                                    <strong>
                                        {degreeName}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Field
                                    </span>

                                    <strong>
                                        {fieldName}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Location
                                    </span>

                                    <strong>
                                        {location}
                                    </strong>

                                </div>


                            </div>

                        </section>


                        {/* =============================================
                           STUDENT
                        ============================================= */}

                        <section className="application-details-card">

                            <div className="application-section-heading">

                                <span>
                                    APPLICANT
                                </span>

                                <h2>
                                    Student information
                                </h2>

                            </div>


                            <div className="application-student">

                                <div className="application-student-icon">

                                    <GraduationCap size={21} />

                                </div>


                                <div>

                                    <strong>
                                        {studentName}
                                    </strong>

                                    <span>
                                        {studentEmail}
                                    </span>

                                </div>

                            </div>

                        </section>


                        {/* =============================================
                           NOTES
                        ============================================= */}

                        <section className="application-details-card">

                            <div className="application-section-heading">

                                <span>
                                    APPLICATION
                                </span>

                                <h2>
                                    Your notes
                                </h2>

                            </div>


                            {notes ? (

                                <div className="application-statement-box">

                                    <p className="application-statement">
                                        {notes}
                                    </p>

                                </div>

                            ) : (

                                <div className="application-empty-content">

                                    <FileText size={21} />

                                    <strong>
                                        No notes
                                    </strong>

                                    <span>
                                        No notes were added to this
                                        application.
                                    </span>

                                </div>

                            )}

                        </section>


                        {/* =============================================
                           DOCUMENTS
                        ============================================= */}

                        {Array.isArray(
                            application.documents
                        ) &&
                            application.documents.length > 0 && (

                                <section className="application-details-card">

                                    <div className="application-section-heading">

                                        <span>
                                            DOCUMENTS
                                        </span>

                                        <h2>
                                            Submitted documents
                                        </h2>

                                    </div>


                                    <div className="application-documents">

                                        {application.documents.map(
                                            (document, index) => {

                                                const documentName =
                                                    document?.name ??
                                                    document?.filename ??
                                                    document?.title ??
                                                    `Document ${index + 1}`;


                                                return (

                                                    <div
                                                        className="application-document"
                                                        key={
                                                            document?.id ??
                                                            index
                                                        }
                                                    >

                                                        <FileText size={17} />


                                                        <div>

                                                            <strong>
                                                                {documentName}
                                                            </strong>


                                                            {document?.type && (

                                                                <span>
                                                                    {
                                                                        document.type
                                                                    }
                                                                </span>

                                                            )}

                                                        </div>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </div>

                                </section>

                            )}

                    </main>


                    {/* =================================================
                       SIDEBAR
                    ================================================= */}

                    <aside className="application-details-sidebar">


                        {/* =============================================
                           STATUS
                        ============================================= */}

                        <div className="application-sidebar-card">

                            <div className="application-sidebar-heading">

                                <Clock3 size={17} />

                                <h3>
                                    Application status
                                </h3>

                            </div>


                            <div
                                className={`application-sidebar-status ${statusClass}`}
                            >

                                <StatusIcon size={20} />


                                <div>

                                    <strong>
                                        {statusLabel}
                                    </strong>

                                    <span>
                                        {getStatusDescription()}
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* =============================================
                           TIMELINE
                        ============================================= */}

                        <div className="application-sidebar-card">

                            <div className="application-sidebar-heading">

                                <CalendarDays size={17} />

                                <h3>
                                    Application timeline
                                </h3>

                            </div>


                            <div className="application-timeline">


                                <div className="timeline-item active">

                                    <div className="timeline-dot" />

                                    <div>

                                        <strong>
                                            Application submitted
                                        </strong>

                                        <span>
                                            {formatDate(
                                                submittedAt
                                            )}
                                        </span>

                                    </div>

                                </div>


                                <div
                                    className={`timeline-item ${statusClass === "pending"
                                        ? ""
                                        : "active"
                                        }`}
                                >

                                    <div className="timeline-dot" />

                                    <div>

                                        <strong>
                                            Application review
                                        </strong>

                                        <span>

                                            {statusClass === "pending"
                                                ? "In progress"
                                                : "Completed"}

                                        </span>

                                    </div>

                                </div>


                                <div
                                    className={`timeline-item ${statusClass === "accepted" ||
                                        statusClass === "rejected" ||
                                        statusClass === "withdrawn"
                                        ? "active"
                                        : ""
                                        }`}
                                >

                                    <div className="timeline-dot" />

                                    <div>

                                        <strong>
                                            Final decision
                                        </strong>

                                        <span>

                                            {statusClass === "accepted"
                                                ? "Accepted"
                                                : statusClass === "rejected"
                                                    ? "Rejected"
                                                    : statusClass === "withdrawn"
                                                        ? "Withdrawn"
                                                        : "Pending"}

                                        </span>

                                    </div>

                                </div>


                                {updatedAt && (

                                    <div className="timeline-last-updated">

                                        Last updated:{" "}

                                        {formatDate(updatedAt)}

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* =============================================
                           OPPORTUNITY LINK
                        ============================================= */}

                        {opportunityId && (

                            <Link
                                to={`/student/opportunities/${opportunityId}`}
                                className="application-view-opportunity"
                            >

                                <GraduationCap size={15} />

                                View Opportunity

                            </Link>

                        )}


                        {/* =============================================
                           BACK
                        ============================================= */}

                        <Link
                            to="/student/applications"
                            className="application-sidebar-back"
                        >

                            <ArrowLeft size={14} />

                            Back to Applications

                        </Link>

                    </aside>

                </div>

            </div>

        </div>

    );

}


export default ApplicationDetails;
