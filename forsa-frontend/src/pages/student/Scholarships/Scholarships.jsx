import {
    Search,
    SlidersHorizontal,
    Heart,
    ArrowRight,
    GraduationCap,
    Globe2,
    CalendarDays,
    DollarSign,
    CheckCircle2,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./Scholarships.css";


function Scholarships() {

    const scholarships = [
        {
            id: 1,
            title: "Global Excellence Scholarship",
            university: "University of Oxford",
            country: "United Kingdom",
            degree: "Master's",
            funding: "Fully Funded",
            deadline: "15 Jan 2027",
            amount: "£25,000",
            description:
                "Scholarship for international students with strong academic performance and leadership experience.",
            match: 96,
        },
        {
            id: 2,
            title: "International Student Scholarship",
            university: "University of Melbourne",
            country: "Australia",
            degree: "Master's",
            funding: "Partial Funding",
            deadline: "30 Nov 2026",
            amount: "$20,000",
            description:
                "Financial support for international students applying to postgraduate programs.",
            match: 91,
        },
        {
            id: 3,
            title: "International Excellence Award",
            university: "University of Toronto",
            country: "Canada",
            degree: "Master's",
            funding: "Partial Funding",
            deadline: "20 Dec 2026",
            amount: "$15,000",
            description:
                "Merit-based funding for international graduate students with strong academic records.",
            match: 88,
        },
        {
            id: 4,
            title: "Academic Merit Scholarship",
            university: "University of Edinburgh",
            country: "United Kingdom",
            degree: "Master's",
            funding: "Partial Funding",
            deadline: "10 Feb 2027",
            amount: "£12,000",
            description:
                "Funding opportunity for international students with academic excellence.",
            match: 84,
        },
        {
            id: 5,
            title: "Graduate Research Scholarship",
            university: "University of Sydney",
            country: "Australia",
            degree: "Master's / PhD",
            funding: "Fully Funded",
            deadline: "05 Dec 2026",
            amount: "$30,000",
            description:
                "Research-focused scholarship for international postgraduate students.",
            match: 82,
        },
        {
            id: 6,
            title: "International Graduate Award",
            university: "University of British Columbia",
            country: "Canada",
            degree: "Master's",
            funding: "Partial Funding",
            deadline: "18 Jan 2027",
            amount: "$18,000",
            description:
                "Award for international graduate students with strong academic potential.",
            match: 79,
        },
    ];


    return (
        <div className="scholarships-page">

            {/* =================================================
                Header
            ================================================= */}

            <section className="scholarships-header">

                <div className="scholarships-header-content">

                    <span className="scholarships-eyebrow">
                        SCHOLARSHIPS
                    </span>

                    <h1>
                        Find scholarships
                        <span>that support your goals</span>
                    </h1>

                    <p>
                        Explore scholarships and funding opportunities
                        from universities and organizations around the world.
                    </p>

                </div>

            </section>


            {/* =================================================
                Search & Filters
            ================================================= */}

            <section className="scholarships-tools">

                <div className="scholarships-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search scholarships, universities or countries..."
                    />

                </div>

                <button className="scholarships-filter-button">
                    <SlidersHorizontal size={17} />
                    Filters
                </button>

            </section>


            {/* =================================================
                Main Content
            ================================================= */}

            <section className="scholarships-content">

                <aside className="scholarships-sidebar">

                    <div className="filter-header">

                        <strong>
                            Filter scholarships
                        </strong>

                        <button>
                            Clear all
                        </button>

                    </div>


                    <div className="filter-group">

                        <h3>
                            Study level
                        </h3>

                        <label>
                            <input type="checkbox" />
                            Bachelor's
                        </label>

                        <label>
                            <input type="checkbox" />
                            Master's
                        </label>

                        <label>
                            <input type="checkbox" />
                            PhD
                        </label>

                    </div>


                    <div className="filter-group">

                        <h3>
                            Funding type
                        </h3>

                        <label>
                            <input type="checkbox" />
                            Fully funded
                        </label>

                        <label>
                            <input type="checkbox" />
                            Partial funding
                        </label>

                        <label>
                            <input type="checkbox" />
                            Tuition waiver
                        </label>

                    </div>


                    <div className="filter-group">

                        <h3>
                            Destination
                        </h3>

                        <label>
                            <input type="checkbox" />
                            United Kingdom
                        </label>

                        <label>
                            <input type="checkbox" />
                            Canada
                        </label>

                        <label>
                            <input type="checkbox" />
                            Australia
                        </label>

                        <label>
                            <input type="checkbox" />
                            United States
                        </label>

                    </div>

                </aside>


                <main className="scholarships-results">

                    <div className="results-header">

                        <div>
                            <strong>
                                Scholarships for you
                            </strong>

                            <span>
                                {scholarships.length} opportunities found
                            </span>
                        </div>

                        <select>
                            <option>
                                Recommended
                            </option>

                            <option>
                                Deadline
                            </option>

                            <option>
                                Highest funding
                            </option>
                        </select>

                    </div>


                    <div className="scholarships-grid">

                        {scholarships.map((scholarship) => (

                            <article
                                className="scholarship-card"
                                key={scholarship.id}
                            >

                                <div className="scholarship-card-top">

                                    <div className="scholarship-icon">
                                        <GraduationCap size={21} />
                                    </div>

                                    <button className="save-scholarship">
                                        <Heart size={17} />
                                    </button>

                                </div>


                                <div className="scholarship-match">
                                    <CheckCircle2 size={13} />
                                    {scholarship.match}% match
                                </div>


                                <h2>
                                    {scholarship.title}
                                </h2>

                                <p className="scholarship-university">
                                    {scholarship.university}
                                </p>


                                <p className="scholarship-description">
                                    {scholarship.description}
                                </p>


                                <div className="scholarship-meta">

                                    <span>
                                        <Globe2 size={14} />
                                        {scholarship.country}
                                    </span>

                                    <span>
                                        <GraduationCap size={14} />
                                        {scholarship.degree}
                                    </span>

                                    <span>
                                        <CalendarDays size={14} />
                                        {scholarship.deadline}
                                    </span>

                                </div>


                                <div className="scholarship-footer">

                                    <div>

                                        <small>
                                            Funding
                                        </small>

                                        <strong>
                                            <DollarSign size={14} />
                                            {scholarship.amount}
                                        </strong>

                                    </div>


                                    <Link
                                        to={`/student/scholarships/${scholarship.id}`}
                                        className="scholarship-view"
                                    >
                                        View
                                        <ArrowRight size={14} />
                                    </Link>

                                </div>

                            </article>

                        ))}

                    </div>

                </main>

            </section>

        </div>
    );
}


export default Scholarships;
