import React from "react";
import { Editor } from "slate-react";

import styled, { css } from "styled-components";

const EditorAreaContainer = styled.div`
  padding-top: 10px;
  padding-left: 13px;
  font-size: 1.4em;
  height: 500px;
`;

class EditorArea extends React.Component {
  renderNode = props => {
    const { attributes, children, node } = props;
    switch (node.type) {
      case "block-quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "heading-one":
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      case "code":
        return <code {...attributes}>{children}</code>;
      default:
        return <div {...attributes}>{children}</div>;
    }
  };

  renderMark = props => {
    const { children, mark } = props;
    switch (mark.type) {
      case "bold":
        return <strong>{children}</strong>;

      case "italic":
        return <em>{children}</em>;
      case "underlined":
        return <u>{children}</u>;
      default:
        return <span>{children}</span>;
    }
  };

  render() {
    const { value, onChange, onKeyDown } = this.props;

    return (
      <EditorAreaContainer>
        <Editor
          placeholder="Cheap as chips.."
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          spellCheck
        />
      </EditorAreaContainer>
    );
  }
}

export default EditorArea;
