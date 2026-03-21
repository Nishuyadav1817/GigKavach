import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Card, CardContent,
  CircularProgress, Alert, Grid, MenuItem, Stepper, Step,
  StepLabel, LinearProgress, Chip, InputAdornment, IconButton
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PERSONAS = [
  { value: "food_delivery", label: "🍔 Food Delivery", platforms: ["Zomato", "Swiggy"] },
  { value: "quick_commerce", label: "⚡ Quick Commerce", platforms: ["Zepto", "Blinkit", "Swiggy Instamart"] },
  { value: "package_delivery", label: "📦 Package Delivery", platforms: ["Amazon Flex", "Dunzo", "Porter", "Shadowfax"] },
  { value: "rideshare_uber", label: "🚗 Uber Driver", platforms: ["Uber"] },
  { value: "rideshare_ola", label: "🚕 Ola Driver", platforms: ["Ola"] },
];

const CITIES = [
  { name: "Mumbai", tier: 1 }, { name: "Delhi", tier: 1 }, { name: "Bengaluru", tier: 1 },
  { name: "Hyderabad", tier: 1 }, { name: "Chennai", tier: 1 }, { name: "Kolkata", tier: 1 },
  { name: "Pune", tier: 2 }, { name: "Jaipur", tier: 2 }, { name: "Lucknow", tier: 2 },
  { name: "Bhubaneswar", tier: 2 }, { name: "Patna", tier: 2 }, { name: "Surat", tier: 2 },
];

const STEPS = ["Account Details", "Personal & Work Info", "AI Risk Assessment"];

const RISK_COLOR = {
  LOW: "#00C9B1",
  MEDIUM: "#F5A623",
  HIGH: "#FF5C7A"
};

export default function RegisterPage({ onSwitchToLogin }) {

  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
    phone: "",
    city: "Bhubaneswar",
    city_tier: 2,
    persona: "food_delivery",
    platform: "Zomato",
    avg_weekly_income: 2500,
    experience_years: 1,
    active_hours_per_day: 8,
  });

  const personaObj = PERSONAS.find(p => p.value === form.persona);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(f => {
      const updated = { ...f, [name]: value };

      if (name === "persona") {
        updated.platform = PERSONAS.find(p => p.value === value)?.platforms[0] || "";
      }

      if (name === "city") {
        const city = CITIES.find(c => c.name === value);
        updated.city_tier = city?.tier || 2;
      }

      return updated;
    });
  };

  const validateStep0 = () => {

    if (!form.username || !form.password || !form.confirmPassword)
      return "Please fill all required fields.";

    if (form.username.length < 3)
      return "Username must be at least 3 characters.";

    if (form.password.length < 6)
      return "Password must be at least 6 characters.";

    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";

    return null;
  };

  const validateStep1 = () => {

    if (!form.name || !form.phone || !form.city)
      return "Please fill all required fields.";

    if (form.avg_weekly_income <= 0)
      return "Please enter a valid weekly income.";

    return null;
  };

  const handleNext = async () => {

    setError("");

    if (step === 0) {

      const err = validateStep0();
      if (err) {
        setError(err);
        return;
      }

      setStep(1);
    }

    else if (step === 1) {

      const err = validateStep1();
      if (err) {
        setError(err);
        return;
      }

      setLoading(true);

      try {

        const result = await register({
          username: form.username,
          password: form.password,
          email: form.email || undefined,
          name: form.name,
          phone: form.phone,
          city: form.city,
          city_tier: Number(form.city_tier),
          persona: form.persona,
          platform: form.platform,
          avg_weekly_income: Number(form.avg_weekly_income),
          experience_years: Number(form.experience_years),
          active_hours_per_day: Number(form.active_hours_per_day),
        });

        setRegistered(result);
        setStep(2);

        setTimeout(() => {
          navigate("/policies");
        }, 2000);

      }
      catch (e) {

        setError(
          e.response?.data?.detail ||
          "Registration failed. Please try again."
        );

      }
      finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#080F1E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box width="100%" maxWidth={520}>

        <Box textAlign="center" mb={3}>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              background: "linear-gradient(135deg,#F5A623,#FFD07A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            GigShield
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Create your worker account
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 3 }}>

            <Stepper activeStep={step} sx={{ mb: 3 }}>
              {STEPS.map((s) => (
                <Step key={s}>
                  <StepLabel
                    sx={{
                      "& .MuiStepLabel-label": {
                        color: "#8A9BB5",
                        fontSize: "0.72rem",
                      },
                      "& .MuiStepLabel-label.Mui-active": {
                        color: "#F5A623",
                      },
                      "& .MuiStepLabel-label.Mui-completed": {
                        color: "#00C9B1",
                      },
                      "& .MuiStepIcon-root.Mui-active": {
                        color: "#F5A623",
                      },
                      "& .MuiStepIcon-root.Mui-completed": {
                        color: "#00C9B1",
                      },
                    }}
                  >
                    {s}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {step === 0 && (
              <Grid container spacing={2}>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Username *"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email (optional)"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    size="small"
                    type="email"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password *"
                    name="password"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    size="small"
                    helperText="Minimum 6 characters"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowPass(s => !s)}
                          >
                            {showPass
                              ? <VisibilityOffIcon fontSize="small" />
                              : <VisibilityIcon fontSize="small" />
                            }
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm Password *"
                    name="confirmPassword"
                    type={showPass ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>

              </Grid>
            )}

            {step === 2 && registered && (

              <Box>

                <Box textAlign="center" mb={2}>

                  <CheckCircleIcon
                    sx={{ fontSize: 52, color: "#00C9B1" }}
                  />

                  <Typography variant="h6" fontWeight={700} mt={1}>
                    Registration Successful!
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Welcome to GigShield, {registered.worker?.name}
                  </Typography>

                </Box>

                <Alert severity="success">
                  Redirecting to dashboard...
                </Alert>

              </Box>

            )}

            {step < 2 && (

              <Box
                display="flex"
                justifyContent="space-between"
                mt={3}
              >

                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={
                    step === 0
                      ? onSwitchToLogin
                      : () => setStep(s => s - 1)
                  }
                >
                  {step === 0 ? "Back to Login" : "Back"}
                </Button>

                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                >

                  {loading
                    ? <CircularProgress size={20} />
                    : step === 0
                      ? "Next"
                      : "Register & Get AI Score"
                  }

                </Button>

              </Box>

            )}

          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}