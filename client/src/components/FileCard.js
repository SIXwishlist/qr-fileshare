import React, {Component} from 'react';
import Card, {CardContent, CardMedia, CardActions} from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import '../styles/FileCard.css';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';

import arrayBufferToBase64 from '../utils/arrayBufferToBase64';

class FileCard extends Component {
  constructor(props) {
    super(props);
    this.file = props.file;
    this.fileName = props.file.originalname;
    this.size = props.file.size;
    this.data = props.file.buffer.data;
    this.mimeType = props.file.mimetype;
    this.isImage = this.isImageType(this.file);
    this.state = {shadow: 1};
  }

  isImageType = () => {
    return this.file.mimetype.split("/")[0] === "image";
  };

  generateDataURI = () => {
    return `data:${this.mimeType};base64,${arrayBufferToBase64(this.data)}`;
  };

  onMouseOver = () => {
    this.setState({shadow: 3});
  };

  onMouseOut = () => {
    this.setState({shadow: 1});
  };

  formatBytes = (bytes, decimals) => {
    if (bytes === 0)
      return '0 Bytes';

    let k = 1024,
        dm = decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  downloadFile = () => {
    const blobData = new Uint8Array(this.data);
    const blob = new Blob([blobData], {type: this.mimeType}),
        downloadLink = document.createElement('a');

    downloadLink.href = window.URL.createObjectURL(blob);
    console.log(downloadLink.href);
    downloadLink.download = this.fileName;
    downloadLink.click();
  };

  deleteFile = (evt) => {
    evt.stopPropagation();
    const queryOptions = {
      method: 'delete'
    };

    fetch(`/api/file/${this.file.id}`, queryOptions).then(response => {
      document.getElementById('deletedSnackbarShowButton').click();
    });
  };

  render() {
    return (
        <div>
          <Tooltip title={this.fileName}>
            <Card onMouseOver={this.onMouseOver}
                  onMouseOut={this.onMouseOut}
                  onClick={this.downloadFile}
                  className={"fileCard " + (!this.isImage && "noImage")}
                  elevation={this.state.shadow}>
              <Grid container spacing={0}>
                <Grid item className="details" xs={7}>
                  <CardContent className={"fileCardContent " + (!this.isImage ? "noImage" : "")}>
                    <Typography className="fileName" variant="subheading" color="inherit" noWrap
                                style={{maxWidth: "calc(100% - 32px)"}}>
                    <span className="fileNameText">
                      {this.fileName}
                    </span>
                    </Typography>

                    <div className="fileDetails">
                      <Typography variant="body1" color="textSecondary">
                        {this.formatBytes(this.size)}
                      </Typography>
                    </div>
                  </CardContent>

                  <CardActions>
                    <Button size="small" color="secondary" onClick={this.deleteFile}>
                      Delete
                    </Button>
                  </CardActions>
                </Grid>
                <Grid item className="details" xs={5}>
                  {
                    this.isImage &&
                    <CardMedia image={this.generateDataURI(this.file)} className="fileCardImage"/>
                  }
                </Grid>
              </Grid>
            </Card>
          </Tooltip>
        </div>
    )
  }
}

export default FileCard;