import React from "react";
import NewCard from "./NewCard";

// import React from 'react';
import CenteredTabs from './CenteredTabs';
import { Paper } from "material-ui";

export default function CardView() {
    return (
        <>
            <div className="card-view-container">
                <div className="card-view">
                    <div style={{ width: "50%", textAlign: "center" }}>
                        <CenteredTabs></CenteredTabs>
                    </div>
                    <NewCard></NewCard>
                    <div className="deck-grid">
                        <Paper />
                    </div>
                </div>
            </div>
        </>
    )
}