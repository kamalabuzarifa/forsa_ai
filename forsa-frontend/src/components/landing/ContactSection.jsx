import {
    ArrowRight,
    Clock3,
    Mail,
    MessageCircle,
    Send,
} from "lucide-react";

import { useState } from "react";

function ContactSection() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        setSubmitted(true);
        event.currentTarget.reset();
    };

    return (
        <section
            className="contact-section"
            id="contact"
        >
            <div className="contact-card">

                <div className="contact-info">

                    <span className="section-label">
                        CONTACT
                    </span>

                    <h2>
                        Have a question?
                        <span>
                            We would love to hear from you.
                        </span>
                    </h2>

                    <p>
                        Whether you need help understanding EduMatch,
                        have a question about an opportunity, or want
                        to explore working with us, send us a message.
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
                                    Get in touch with our team
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
                                    Questions about using EduMatch
                                </span>
                            </div>

                        </div>

                        <div className="contact-detail">

                            <div className="contact-detail-icon">
                                <Clock3 size={18} />
                            </div>

                            <div>
                                <strong>
                                    Send us a message
                                </strong>

                                <span>
                                    We will get back to you as soon as possible
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="contact-form-wrapper">

                    {submitted ? (
                        <div className="contact-success">

                            <div className="contact-success-icon">
                                <Send size={21} />
                            </div>

                            <h3>
                                Thanks for reaching out.
                            </h3>

                            <p>
                                Your message is ready to send. The contact
                                endpoint is not connected in this environment,
                                so no message has been submitted yet.
                            </p>

                            <button
                                type="button"
                                className="contact-reset"
                                onClick={() => setSubmitted(false)}
                            >
                                Send another message
                                <ArrowRight size={15} />
                            </button>

                        </div>
                    ) : (
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
                                        autoComplete="name"
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
                                        autoComplete="email"
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
                                    placeholder="What can we help you with?"
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
                                    placeholder="Tell us how we can help..."
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="contact-submit"
                            >
                                Send message
                                <Send size={17} />
                            </button>

                        </form>
                    )}

                </div>

            </div>
        </section>
    );
}

export default ContactSection;
