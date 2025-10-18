import React from 'react';
import { Button, TextField, Typography, Card, CardContent, CardActions } from '@mui/material';

function App() {
    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            {/* Title */}
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to Material-UI
            </Typography>

            {/* Text Field */}
            <TextField label="Enter your name" variant="outlined" style={{ width: '300px' }} />
                
               
           

            {/* Card Example */}
            <Card style={{ width: '300px' }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        MUI Card
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        This is an example of a card component using Material-UI.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary">
                        Learn More
                    </Button>
                </CardActions>
            </Card>

            {/* Button */}
            <Button variant="contained" color="primary">
                Click Me
            </Button>
        </div>
    );
}

export default App;
