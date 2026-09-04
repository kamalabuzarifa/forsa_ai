import {
    Clock3,
    Mail,
    MessageCircle,
    Send,
} from "lucide-react";

function ContactSection() {

    const handleSubmit = (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        const data = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim(),
        };

        console.log("Contact form data", data);

        form.reset();
    };


    return (
        <section
            className="contact-section"
            id="contact"
        >

            <div className="contact-card">

                <div className="contact-info">

                    <span className="section-label">
                        CONTACT US
                    </span>


                    <h2>
                        Have a question?

                        <span>
                            Talk to us.
                        </span>
                    </h2>


                    <p>
                        Need help with your account or have a
                        question about an opportunity? Our team
                        is here to help.
                    </p>


                    <div className="contact-details">

                        <div className="contact-detail">

                            <div className="contact-detail-icon">
                                <Mail size={18} />
                            </div>

                            <div>

                                <strong>
                                    Email
                                </strong>

                                <span>
                                    support@edumatch.com
                                </span>

                            </div>

                        </div>


                        <div className="contact-detail">

                            <div className="contact-detail-icon">
                                <MessageCircle size={18} />
                            </div>

                            <div>

                                <strong>
                                    Support
                                </strong>

                                <span>
                                    We are here to help you
                                </span>

                            </div>

                        </div>


                        <div className="contact-detail">

                            <div className="contact-detail-icon">
                                <Clock3 size={18} />
                            </div>

                            <div>

                                <strong>
                                    Response time
                                </strong>

                                <span>
                                    Within 1–2 business days
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                <form
                    className="contact-form"
                    onSubmit={handleSubmit}
                >

                    <div className="contact-row">

                        <div className="contact-field">

                            <label htmlFor="contact-name">
                                Name
                            </label>

                            <input
                                id="contact-name"
                                name="name"
                                type="text"
                                placeholder="Your name"
                                required
                            />

                        </div>


                        <div className="contact-field">

                            <label htmlFor="contact-email">
                                Email
                            </label>

                            <input
                                id="contact-email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                            />

                        </div>

                    </div>


                    <div className="contact-field">

                        <label htmlFor="contact-subject">
                            Subject
                        </label>

                        <input
                            id="contact-subject"
                            name="subject"
                            type="text"
                            placeholder="How can we help?"
                            required
                        />

                    </div>


                    <div className="contact-field">

                        <label htmlFor="contact-message">
                            Message
                        </label>

                        <textarea
                            id="contact-message"
                            name="message"
                            rows="5"
                            placeholder="Write your message..."
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="contact-submit"
                    >
                        Send Message
                        <Send size={17} />
                    </button>

                </form>

            </div>

        </section>
    );
}

export default ContactSection;
