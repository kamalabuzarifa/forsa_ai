import {
    Search,
    MapPin,
    GraduationCap,
} from "lucide-react";

import "./SearchBar.css";

function SearchBar() {
    return (
        <div className="student-search">

            <div className="student-search-field">

                <Search size={19} />

                <div>
                    <span>What do you want to study?</span>

                    <input
                        type="text"
                        placeholder="Program, subject or keyword"
                    />
                </div>

            </div>


            <div className="student-search-divider" />


            <div className="student-search-field">

                <MapPin size={19} />

                <div>
                    <span>Where?</span>

                    <input
                        type="text"
                        placeholder="Country or city"
                    />
                </div>

            </div>


            <div className="student-search-divider" />


            <div className="student-search-field">

                <GraduationCap size={19} />

                <div>
                    <span>Study level</span>

                    <select defaultValue="">
                        <option value="" disabled>
                            Select level
                        </option>

                        <option value="bachelor">
                            Bachelor's
                        </option>

                        <option value="master">
                            Master's
                        </option>

                        <option value="phd">
                            PhD
                        </option>
                    </select>
                </div>

            </div>


            <button className="student-search-button">
                <Search size={18} />
                Search
            </button>

        </div>
    );
}

export default SearchBar;
