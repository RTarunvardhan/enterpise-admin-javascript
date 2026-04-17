"use client";

import { useState, useEffect } from "react";
import { loginUser } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

/**
 * PAGE: SignIn
 * -----------------------------------
 * INPUT: None
 * OUTPUT: Login UI
 *
 * PURPOSE:
 *  Authenticate user and store in localStorage
 */

export default function SignIn() {
  const router = useRouter();

  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const user = loginUser(userName, password);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/");
    } else {
      alert("Invalid credentials");
    }
  };

  useEffect(() => {
    console.log("localStorage: ", localStorage);
  }, []);

  //   return (
  //     <Box className="glass-card" p={4} maxWidth={400} mx="auto" mt={10}>
  //       <TextField
  //         fullWidth
  //         label="User Name"
  //         onChange={(e) => setUserName(e.target.value)}
  //       />
  //       <TextField
  //         fullWidth
  //         label="Password"
  //         type="password"
  //         sx={{ mt: 2 }}
  //         onChange={(e) => setPassword(e.target.value)}
  //       />
  //       <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleLogin}>
  //         Login
  //       </Button>
  //     </Box>
  //   );
  // }

  // "use client";

  // import { useState, useEffect } from "react";
  // import { useRouter } from "next/navigation";
  // import { users } from "../data/users";
  // import { login, getUser } from "../lib/auth";
  // import {
  //   Box,
  //   Paper,
  //   TextField,
  //   Button,
  //   Typography,
  // } from "@mui/material";

  // export default function SignIn() {
  //   const router = useRouter();

  //   const [form, setForm] = useState({
  //     username: "",
  //     password: "",
  //   });

  //   const [tilt, setTilt] = useState({ x: 0, y: 0 });

  //   const handleChange = (e) => {
  //     setForm({
  //       ...form,
  //       [e.target.name]: e.target.value,
  //     });
  //   };

  //   const handleLogin = () => {
  //     const user = users.find(
  //       (u) => u.username === form.username && u.password === form.password
  //     );

  //     if (user) {
  //       login(user.username);
  //       router.push("/Dashboard");
  //     } else {
  //       alert("Invalid credentials");
  //     }
  //   };

  //   useEffect(() => {
  //     const user = getUser();
  //     if (user) router.push("/");
  //   }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / 20;
    const y = (e.clientX - rect.left - rect.width / 2) / 20;
    setTilt({ x, y });
  };

  const resetTilt = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        backgroundImage:
          "url('/bg-14.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(5px)",
        }}
      />

      {/* 3D Glass Card */}
      <Paper
        elevation={0}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        onKeyDown={handleKeyDown}
        sx={{
          position: "relative",
          padding: 4,
          width: { xs: "90%", sm: "400px" },
          display: "flex",
          flexDirection: "column",
          gap: 3,

          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.2s ease",

          background: "rgba(58, 53, 53, 0.4)",
          backdropFilter: "blur(15px)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.2)",

          boxShadow: `
            0 10px 30px rgba(0,0,0,0.5),
            inset 0 1px 1px rgba(255,255,255,0.2),
            inset 0 -1px 1px rgba(0,0,0,0.2)
          `,

          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "-50%",
            width: "200%",
            height: "100%",
            background:
              "linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent)",
            transform: "rotate(25deg)",
            pointerEvents: "none",
          }}
        />

        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            color: "#fff",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          Welcome
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          sx={{ color: "rgba(255,255,255,0.7)" }}
        >
          Sign in to continue
        </Typography>

        <TextField
          label="Username"
          name="username"
          fullWidth
          onChange={(e) => setUserName(e.target.value)}
          sx={{
            input: { color: "#fff" },
            label: { color: "rgba(255,255,255,0.7)" },
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              borderRadius: "12px",

              "& input": {
                color: "#fff !important",
                WebkitTextFillColor: "#fff !important", // 🔥 force white text
              },

              "& input:-webkit-autofill, \
                 & input:-webkit-autofill:hover, \
                 & input:-webkit-autofill:focus, \
                 & input:-webkit-autofill:active": {
                WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
                WebkitTextFillColor: "#fff !important",
                caretColor: "#fff",
                borderRadius: "12px",
                transition: "background-color 9999s ease-in-out 0s",
              },

              "& fieldset": {
                borderColor: "rgba(255,255,255,0.2)",
              },

              "&:hover fieldset": {
                borderColor: "#6366f1",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#8b5cf6",
                boxShadow: "0 0 8px #8b5cf6",
              },
            },

            "& .MuiInputLabel-root": {
              color: "#aaa",
            },

            "& .MuiInputLabel-root.Mui-focused": {
              color: "#8b5cf6",
            },
          }}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            input: { color: "#fff" },
            label: { color: "rgba(255,255,255,0.7)" },
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              borderRadius: "12px",

              "& input": {
                color: "#fff !important",
                WebkitTextFillColor: "#fff !important", // 🔥 force white text
              },

              "& input:-webkit-autofill, \
                 & input:-webkit-autofill:hover, \
                 & input:-webkit-autofill:focus, \
                 & input:-webkit-autofill:active": {
                WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
                WebkitTextFillColor: "#fff !important",
                caretColor: "#fff",
                borderRadius: "12px",
                transition: "background-color 9999s ease-in-out 0s",
              },

              "& fieldset": {
                borderColor: "rgba(255,255,255,0.2)",
              },

              "&:hover fieldset": {
                borderColor: "#6366f1",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#8b5cf6",
                boxShadow: "0 0 8px #8b5cf6",
              },
            },

            "& .MuiInputLabel-root": {
              color: "#aaa",
            },

            "& .MuiInputLabel-root.Mui-focused": {
              color: "#8b5cf6",
            },
          }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{
            mt: 1,
            padding: "12px",
            borderRadius: "12px",
            fontWeight: 600,
            background: "linear-gradient(135deg, #ff7e5f, #feb47b)",
            boxShadow: "0 5px 20px rgba(0,0,0,0.4)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
            },
          }}
        >
          SIGN IN
        </Button>
      </Paper>
    </Box>
  );
}