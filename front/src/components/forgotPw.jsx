import React, { useState } from "react";

function ForgotPw() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // TO DO : send email to me
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2 className="forgot-msg">
                Forgot your password ? <br /> Give us the email address you used
                to create your account and we'll take care of the rest !
            </h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Email"
                alt="Email"
            />
            <button className="form-button" type="submit">
                Send
            </button>
        </form>
    );
}

export default ForgotPw;
