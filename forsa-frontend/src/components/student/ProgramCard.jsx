import {
    MapPin,
    Clock3,
    GraduationCap,
    Heart,
    ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./ProgramCard.css";

function ProgramCard({ program }) {
    return (
        <article className="program-card">

            <div className="program-card-top">

                <div className="program-university-logo">
                    {program.university.charAt(0)}
                </div>

                <button
                    className="program-save"
                    type="button"
                    aria-label="Save program"
                >
                    <Heart size={16} />
                </button>

            </div>


            <div className="program-card-body">

                <span className="program-university">
                    {program.university}
                </span>

                <h3>
                    {program.program}
                </h3>

                <div className="program-location">
                    <MapPin size={13} />
                    {program.location}
                </div>


                <div className="program-details">

                    <span>
                        <GraduationCap size={13} />
                        {program.degree}
                    </span>

                    <span>
                        <Clock3 size={13} />
                        {program.duration}
                    </span>

                </div>


                <div className="program-card-bottom">

                    <div>
                        <span className="program-tuition-label">
                            Tuition
                        </span>

                        <strong>
                            {program.tuition}
                        </strong>
                    </div>

                    <div className="program-match">
                        <span>
                            {program.match}%
                        </span>

                        <small>
                            Match
                        </small>
                    </div>

                </div>


                <Link
                    to={`/student/programs/${program.id}`}
                    className="program-view-button"
                >
                    View program
                    <ArrowRight size={14} />
                </Link>

            </div>

        </article>
    );
}

export default ProgramCard;
