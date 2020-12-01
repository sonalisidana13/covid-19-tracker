import React from 'react';
import {
    Card, CardContent, Typography 
} from "@material-ui/core";

function InfoBox({title, cases, total}) {
    return (
        <div>
            <Card>
                <CardContent>
                    <Typography className="info-box-title" color="textSecondary">
                        {title}
                    </Typography>
                    <h2 className="info-box-cases">{cases}</h2>
                    <Typography className="info-box-total" color="textSecondary">
                        {total} Total
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default InfoBox
