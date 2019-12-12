import React, { Component } from "react";
import { TextField, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import DifficultyLevel from "./DifficultyLevel";

const BODY_PARTS = [
  "mind",
  "legs",
  "back",
  "neck",
  "shoulders",
  "hands",
  "feet",
  "core"
];

const withMyStyles = withStyles(theme => ({
  root: {
    height: "100vh"
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

class AddVideo extends Component {
  state = {
    videoUrl: "",
    bodyParts: [],
    difficultyLevel: "",
    creationError: null,
    bodyPartsError: null
  };

  //  error = this.state.bodyParts.filter(v => v).length < 1;

  onVideoCreation = event => {
    event.preventDefault();
    axios
      .post("/api/videos", {
        videoUrl: this.state.videoUrl,
        bodyParts: this.state.bodyParts,
        difficultyLevel: this.state.difficultyLevel
      })
      .then(response => {
        this.props.history.push(`videos/${response.data._id}`); // go to created video
      })
      .catch(error => {
        if (error.response.status === 409) {
          this.setState({
            creationError: error.response.data.message
          });
        } else if (error.response.status === 422) {
          this.setState({
            creationError: error.response.data.message
          });
        } else if (error.response.status === 400) {
          this.setState({
            bodyPartsError: error.response.data.error
          });
        } else {
          this.setState({
            creationError: "Oops, something went wrong."
          });
        }
      });
  };

  onVideoUrlChange = event => {
    this.setState({ videoUrl: event.target.value });
  };

  onBodyPartsChange = event => {
    if (event.target.checked) {
      this.setState({
        bodyParts: [...this.state.bodyParts, event.target.value]
      });
    } else {
      this.setState({
        bodyParts: this.state.bodyParts.filter(
          elem => elem !== event.target.value
        )
      });
    }
  };

  onDifficultyLevelChange = event => {
    this.setState({ difficultyLevel: event.target.value });
  };
  // onDifficultyLevelChange = event => {
  //
  // };
  render() {
    return (
      <div class="add-video-page">
        <h2>Add a video</h2>
        <div class="container-fluid grid">
          <div class="row pull-center">
            <div class="col-md-6">
              <form
                className="{classes.container}"
                noValidate
                autoComplete="off"
              >
                <div>
                  <div class="well">
                    <div class="add-card">
                      <p className="add-video-p">
                        Enter the url of the video you want to add*:
                      </p>
                      <TextField
                        error={this.state.creationError ? true : false}
                        helperText={this.state.creationError}
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        name="video-url"
                        label="Video URL"
                        id="standard-required"
                        onChange={this.onVideoUrlChange}
                        value={this.state.videoUrl}
                      />
                      <p className="add-video-p">
                        Pick the targeted body parts
                      </p>
                      {BODY_PARTS.map(bodyPart => (
                        <div class="form-check form-check-inline">
                          <div key={BODY_PARTS.indexOf(bodyPart)}>
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="inlineCheckbox1"
                              value={bodyPart}
                              onChange={this.onBodyPartsChange}
                              // checked={this.state.bodyParts.includes(bodyPart)}
                            />
                            <label
                              class="form-check-label"
                              for="inlineCheckbox1"
                            >
                              {bodyPart}
                            </label>
                          </div>
                        </div>
                      ))}
                      <p className="add-video-p" id="error-msg">
                        {this.state.bodyPartsError}
                      </p>
                      <DifficultyLevel
                        initialDifficulty={this.state.difficultyLevel}
                        onDifficultyLevelChange={this.onDifficultyLevelChange}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        className="{classes.button}"
                        onClick={this.onVideoCreation}
                      >
                        Submit
                      </Button>
                      <p className="add-video-p">
                        * At the moment we only support youtube videos
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withMyStyles(withRouter(AddVideo));
