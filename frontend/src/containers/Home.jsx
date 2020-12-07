import React from "react";
import { Link } from 'react-router-dom';
import "./Home.css";

export default function Home() {
    return (
        <div className="Home">
            <div className="lander">
                <h1>TODO</h1>
                <p className="text-muted">a DDAPI proof of concept</p>

                <p>
                    <Link to="/login">
                        Click here to login</Link>

                </p>
                <p>
                    <Link to="/login">
                        or here to signup</Link>
                </p>
            </div>
        </div>
    );
}
