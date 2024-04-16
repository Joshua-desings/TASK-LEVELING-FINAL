import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { animated, useTransition } from "react-spring";

const DeadlinePicker = ({ handleSetDeadline }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [isDateTimeEnabled, setIsDateTimeEnabled] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showDateTime, setShowDateTime] = useState(false);

  const transitions = useTransition(showDateTime, {
    from: { height: 0, opacity: 0, marginTop: 0 },
    enter: { height: "auto", opacity: 1, marginTop: 16 },
    leave: { height: 0, opacity: 0, marginTop: 0 },
    config: { duration: 300 },
  });

  const handleToggleDateTime = () => {
    setIsDateTimeEnabled(!isDateTimeEnabled);
    setShowDateTime(!showDateTime);
    // Reset selected values when disabling date and time
    if (!isDateTimeEnabled) {
      setSelectedDate(null);
      setSelectedTime("12:00");
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value ? new Date(event.target.value) : null);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  // Validate date and time before saving
  const handleSave = () => {
    if (!isDateTimeEnabled) {
      handleSetDeadline(null);
      return;
    }

    if (
      !selectedDate ||
      new Date(selectedDate + "T" + selectedTime) <= new Date()
    ) {
      setShowError(true);
      return;
    }

    const combinedDateTime = new Date(selectedDate + "T" + selectedTime);
    handleSetDeadline(combinedDateTime);
  };

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "background.paper",
        borderRadius: "8px",
        boxShadow: 1,
        transition: "height 0.3s",
      }}
    >
      <Typography variant="h7" fontWeight="bold" gutterBottom>
        ¿Quiere establecer un tiempo límite para su misión?
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={isDateTimeEnabled}
                onChange={handleToggleDateTime}
              />
            }
            label="Establecer Fecha y Hora"
          />
        </Grid>
        <Grid item xs={12}>
          {transitions((style, item) =>
            item ? (
              <animated.div style={{ ...style, overflow: "hidden", width: "100%" }}>
                <Grid container spacing={2}>
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="deadline-date"
                        label="Fecha de la Misión"
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={handleDateChange}
                        fullWidth
                        sx={{ marginTop: "5px" }} // Add margin top
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="deadline-time"
                        label="Hora de la Misión"
                        type="time"
                        defaultValue={selectedTime}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={handleTimeChange}
                        fullWidth
                        sx={{ marginTop: "5px" }} // Add margin top
                      />
                    </Grid>
                  </>
                </Grid>
              </animated.div>
            ) : null
          )}
        </Grid>
      </Grid>
      <Collapse in={showError}>
        <Alert severity="error" onClose={handleCloseError} sx={{ mt: 2 }}>
          {isDateTimeEnabled
            ? "La fecha y hora seleccionadas deben ser en el futuro."
            : "Por favor, active la selección de fecha y hora."}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default DeadlinePicker;
