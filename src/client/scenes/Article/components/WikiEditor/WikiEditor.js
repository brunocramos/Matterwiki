import React, { Component } from "react";
import { Value } from "slate";
import styled, { css } from "styled-components";

import EditorToolbar from "./EditorToolbar";
import EditorArea from "./EditorArea";

const initialEmptyValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: ""
              }
            ]
          }
        ]
      }
    ]
  }
});

const WikiEditorContainer = styled.div`
  background: #fafafa;
`;

class WikiEditor extends Component {
  state = {
    value: initialEmptyValue
  };

  handleChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    return (
      <WikiEditorContainer>
        <EditorToolbar value={this.state.value} onChange={this.handleChange} />
        <EditorArea value={this.state.value} onChange={this.handleChange} />
      </WikiEditorContainer>
    );
  }
}

export default WikiEditor;
