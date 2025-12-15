import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
} from "@mui/material";

import useAuthStore from "../store/authStore";

export default function Matching() {
  const { token } = useAuthStore();

  const headers = { Authorization: `Bearer ${token}` };

  const [organs, setOrgans] = useState([]);
  const [selectedOrgan, setSelectedOrgan] = useState("");
  const [matches, setMatches] = useState([]);

  // ----------------------------
  // Load Available Organs
  // ----------------------------
  const loadOrgans = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/organs", { headers });
      const available = res.data.filter((o) => o.status === "AVAILABLE");
      setOrgans(available);
    } catch (err) {
      console.error("LOAD ORGANS ERROR:", err);
    }
  };

  // ----------------------------
  // Fetch Matching Results
  // ----------------------------
  const fetchMatches = async (organId) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/matches/run",
        { organ_id: organId },
        { headers }
      );

      setMatches(res.data.matches || []);
    } catch (err) {
      console.error("MATCHING ERROR:", err);
    }
  };

  // ----------------------------
  // Allocate Match
  // ----------------------------
  const allocateOrgan = async (recipientId) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/matches/allocate",
        { organ_id: selectedOrgan, recipient_id: recipientId },
        { headers }
      );

      alert("Organ allocated successfully!");
      loadOrgans();
      setMatches([]);
      setSelectedOrgan("");
    } catch (err) {
      console.error("ALLOCATE ERROR:", err);
      alert("Allocation failed");
    }
  };

  useEffect(() => {
    loadOrgans();
  }, []);

  // ----------------------------
  // UI COMPONENTS
  // ----------------------------

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold">
        Organ–Recipient Matching
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Select an Organ</Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Select Organ</InputLabel>
          <Select
            value={selectedOrgan}
            label="Select Organ"
            onChange={(e) => {
              setSelectedOrgan(e.target.value);
              fetchMatches(e.target.value);
            }}
          >
            {organs.map((o) => (
              <MenuItem key={o.id} value={o.id}>
                {`#${o.id} — ${o.organ_type} (${o.blood_group})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {matches.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Matching Results (Ranked)
          </Typography>

          <Grid container spacing={2}>
            {matches.map((m, index) => (
              <Grid item xs={12} md={6} key={m.recipient_id}>
                <Card sx={{ p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">
                      #{index + 1}. Recipient ID: {m.recipient_id}
                    </Typography>

                    <Chip
                      label={`Score: ${m.total_score}`}
                      color="primary"
                      sx={{ mt: 1, mb: 2 }}
                    />

                    {/* Score Breakdown */}
                    <Typography>
                      🔬 <b>Blood Match:</b> {m.scores.blood_match}
                    </Typography>
                    <Typography>
                      🧬 <b>HLA Match:</b> {m.scores.hla_match}
                    </Typography>
                    <Typography>
                      📍 <b>Distance:</b> {m.scores.distance_score}
                    </Typography>
                    <Typography>
                      ⚠️ <b>Urgency:</b> {m.scores.urgency_score}
                    </Typography>

                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => allocateOrgan(m.recipient_id)}
                    >
                      Allocate Organ
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {selectedOrgan && matches.length === 0 && (
        <Typography mt={3} align="center" color="text.secondary">
          No matching recipients found.
        </Typography>
      )}
    </Box>
  );
}
