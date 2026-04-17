// import { CircularProgress, Box } from "@mui/material";

// /**
//  * COMPONENT: GlobalLoader
//  * -----------------------------------
//  * INPUT: None
//  * OUTPUT: Loader UI
//  *
//  * PURPOSE:
//  *  Used during route loading / async operations
//  */

// export default function GlobalLoader() {
//     return (
//         <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             height="100vh"
//         >
//             <CircularProgress />
//         </Box>
//     );
// }

"use client";

import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";

export default function GlobalLoader({ open }) {
    if (!open) return null;

    return (
        <Backdrop
            open={open}
            transitionDuration={300}
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 99999,
                color: "#fff",
                flexDirection: "column",
                // backgroundColor: "rgba(0,0,0,0.6)",
                backgroundColor: "rgb(120, 120, 120, 0.8)",
                backdropFilter: "blur(10px)",
            }}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}