import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Check,
    GraduationCap,
    MapPin,
    Star,
    Trash2,
    Wallet,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./Compare.css";

function Compare() {
    const comparisonItems = [
        {
            id: 1,
            university: "University of York",
            country: "United Kingdom",
            program: "MSc Artificial Intelligence",
            degree: "Master's Degree",
            duration: "1 Year",
            tuition: "£31,900",
            rating: "4.7",
            match: 94,
            intake: "September 2026",
            mode: "On Campus",
            type: "Full-time",
        },
        {
            id: 2,
            university: "University of Glasgow",
            country: "United Kingdom",
            program: "MSc Data Science",
            degree: "Master's Degree",
            duration: "1 Year",
            tuition: "£30,240",
            rating: "4.6",
            match: 91,
            intake: "September 2026",
            mode: "On Campus",
            type: "Full-time",
        },
        {
            id: 3,
            university: "University of Leicester",
            country: "United Kingdom",
            program: "MSc Artificial Intelligence",
            degree: "Master's Degree",
            duration: "1 Year",
            tuition: "£25,650",
            rating: "4.5",
            match: 88,
            intake: "September 2026",
            mode: "On Campus",
            type: "Full-time",
        },
    ];

    const removeItem = (id) => {
        console.log("Remove comparison item:", id);
    };

    return (
        <div className="compare-page">

            {/* Header */}

            <section className="compare-header">

                <div className="compare-header-content">

                    <Link
                        to="/student/explore"
                        className="compare-back"
                    >
                        <ArrowLeft size={15} />
                        Back to Explore
                    </Link>

                    <span className="compare-label">
                        COMPARE
                    </span>

                    <h1>
                        Compare your
                        <span> options</span>
                    </h1>

                    <p>
                        Compare universities and programs side by side
                        to find the option that fits your goals.
                    </p>

                </div>

            </section>


            {/* Comparison */}

            <main className="compare-container">

                {comparisonItems.length > 0 ? (

                    <>

                        <div className="compare-toolbar">

                            <div>
                                <strong>
                                    {comparisonItems.length} programs
                                </strong>

                                <span>
                                    selected for comparison
                                </span>
                            </div>

                            <button
                                className="compare-clear"
                                type="button"
                            >
                                Clear all
                            </button>

                        </div>


                        <div className="compare-table-wrapper">

                            <div className="compare-table">

                                {/* Program Cards */}

                                <div className="compare-program-row">

                                    <div className="compare-feature-title">
                                        Programs
                                    </div>

                                    {comparisonItems.map((item) => (
                                        <div
                                            className="compare-program"
                                            key={item.id}
                                        >

                                            <button
                                                className="compare-remove"
                                                type="button"
                                                onClick={() =>
                                                    removeItem(item.id)
                                                }
                                                aria-label={`Remove ${item.program}`}
                                            >
                                                <Trash2 size={14} />
                                            </button>

                                            <div className="compare-university-icon">
                                                <GraduationCap size={22} />
                                            </div>

                                            <span className="compare-university">
                                                {item.university}
                                            </span>

                                            <span className="compare-country">
                                                <MapPin size={11} />
                                                {item.country}
                                            </span>

                                            <h2>
                                                {item.program}
                                            </h2>

                                            <div className="compare-match">

                                                <span>
                                                    {item.match}% Match
                                                </span>

                                                <div className="compare-match-bar">
                                                    <span
                                                        style={{
                                                            width: `${item.match}%`,
                                                        }}
                                                    />
                                                </div>

                                            </div>

                                            <Link
                                                to={`/student/programs/${item.id}`}
                                                className="compare-view"
                                            >
                                                View program
                                                <ArrowRight size={13} />
                                            </Link>

                                        </div>
                                    ))}

                                </div>


                                {/* Degree */}

                                <CompareRow
                                    icon={<GraduationCap size={16} />}
                                    title="Degree"
                                    items={comparisonItems.map(
                                        (item) => item.degree
                                    )}
                                />


                                {/* Duration */}

                                <CompareRow
                                    icon={<BookOpen size={16} />}
                                    title="Duration"
                                    items={comparisonItems.map(
                                        (item) => item.duration
                                    )}
                                />


                                {/* Tuition */}

                                <CompareRow
                                    icon={<Wallet size={16} />}
                                    title="Tuition fee"
                                    items={comparisonItems.map(
                                        (item) => item.tuition
                                    )}
                                />


                                {/* Rating */}

                                <div className="compare-row">

                                    <div className="compare-row-title">

                                        <Star size={16} />

                                        <span>
                                            Rating
                                        </span>

                                    </div>

                                    {comparisonItems.map((item) => (
                                        <div
                                            className="compare-value compare-rating"
                                            key={item.id}
                                        >

                                            <Star
                                                size={14}
                                                fill="currentColor"
                                            />

                                            {item.rating}

                                        </div>
                                    ))}

                                </div>


                                {/* Intake */}

                                <CompareRow
                                    title="Intake"
                                    items={comparisonItems.map(
                                        (item) => item.intake
                                    )}
                                />


                                {/* Study Mode */}

                                <CompareRow
                                    title="Study mode"
                                    items={comparisonItems.map(
                                        (item) => item.mode
                                    )}
                                />


                                {/* Study Type */}

                                <CompareRow
                                    title="Study type"
                                    items={comparisonItems.map(
                                        (item) => item.type
                                    )}
                                />


                                {/* Application */}

                                <div className="compare-row compare-action-row">

                                    <div className="compare-row-title">
                                        <span>
                                            Application
                                        </span>
                                    </div>

                                    {comparisonItems.map((item) => (
                                        <div
                                            className="compare-value"
                                            key={item.id}
                                        >

                                            <Link
                                                to={`/student/programs/${item.id}`}
                                                className="compare-apply"
                                            >
                                                View program
                                                <ArrowRight size={13} />
                                            </Link>

                                        </div>
                                    ))}

                                </div>

                            </div>

                        </div>

                    </>

                ) : (

                    <div className="compare-empty">

                        <div className="compare-empty-icon">
                            <GraduationCap size={28} />
                        </div>

                        <h2>
                            Nothing to compare yet
                        </h2>

                        <p>
                            Save programs or universities while exploring
                            EduMatch and compare them here.
                        </p>

                        <Link
                            to="/student/explore"
                            className="compare-explore-button"
                        >
                            Explore programs
                            <ArrowRight size={15} />
                        </Link>

                    </div>

                )}

            </main>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Comparison Row
|--------------------------------------------------------------------------
*/

function CompareRow({ icon, title, items }) {
    return (
        <div className="compare-row">

            <div className="compare-row-title">

                {icon}

                <span>
                    {title}
                </span>

            </div>

            {items.map((item, index) => (
                <div
                    className="compare-value"
                    key={`${title}-${index}`}
                >
                    {item}
                </div>
            ))}

        </div>
    );
}

export default Compare;
