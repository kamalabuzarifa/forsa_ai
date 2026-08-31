import "./LoadingScreen.css";

function LoadingScreen() {
    return (
        <div className="loading-screen">

            <div className="loading-wrapper">

                <div className="loading-spinner"></div>

                <div className="loading-logo">
                    <span className="loading-logo-inner"></span>
                </div>

            </div>

            <div className="loading-brand">
                EduMatch
            </div>

        </div>
    );
}

export default LoadingScreen;
