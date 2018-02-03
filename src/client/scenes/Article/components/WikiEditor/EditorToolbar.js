import React from "react";
import styled, { css } from "styled-components";

import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Code,
  LooksOne,
  LooksTwo,
  Looks3,
  FormatQuote,
  FormatListNumbered,
  FormatListBulleted,
  InsertLink,
  InsertPhoto,
  GridOn,
  InsertEmoticon
} from "material-ui-icons";

const ToolbarButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 1rem;
  margin: 0;
  cursor: pointer;
  color: #4d4d4d;

  &:hover {
    color: #ff0066;
  }
`;

const ToolbarContainer = styled.div`
  border-bottom: 1px solid #eeeeee;
  margin-top: 2px;
`;

const ToolbarBlock = styled.div`
  display: inline-flex;
  border-right: 1px solid #eeeeee;
`;

const markButtonConfig = [
  { type: "bold", icon: <FormatBold /> },
  { type: "italic", icon: <FormatItalic /> },
  { type: "underlined", icon: <FormatUnderlined /> }
];

const blockButtonConfig = [
  { type: "heading-one", icon: <LooksOne /> },
  { type: "heading-two", icon: <LooksTwo /> },
  { type: "heading-three", icon: <Looks3 /> },
  { type: "code", icon: <Code /> },
  { type: "block-quote", icon: <FormatQuote /> }
];

const DEFAULT_NODE = "paragraph";

class EditorToolbar extends React.Component {
  onClickMark = (event, type) => {
    event.preventDefault();
    const { value, onChange } = this.props;
    const change = value.change().toggleMark(type);
    onChange(change);
  };

  onClickBlock = (event, type) => {
    event.preventDefault();
    const { value, onChange } = this.props;

    const change = value.change();

    const isActive = value.blocks.some(node => node.type === type);

    change.setBlock(isActive ? DEFAULT_NODE : type);

    onChange(change);
  };

  render() {
    return (
      <ToolbarContainer>
        {this.renderMarkButtons()}
        {this.renderBlockButtons()}
      </ToolbarContainer>
    );
  }

  renderMarkButtons = () => {
    const handleMouseDown = type => event => this.onClickMark(event, type);
    return (
      <ToolbarBlock>
        {markButtonConfig.map(({ type, icon }) => this.renderButton(type, icon, handleMouseDown))}
      </ToolbarBlock>
    );
  };

  renderBlockButtons = () => {
    const handleMouseDown = type => event => this.onClickBlock(event, type);

    return (
      <ToolbarBlock>
        {blockButtonConfig.map(({ type, icon }) => this.renderButton(type, icon, handleMouseDown))}
      </ToolbarBlock>
    );
  };

  renderButton = (type, icon, handleMouseDown) => (
    <ToolbarButton key={type} onMouseDown={handleMouseDown(type)}>
      {icon}
    </ToolbarButton>
  );
}

const EditorToolbar1 = () => (
  <ToolbarContainer>
    <ToolbarBlock>
      <ToolbarButton>
        <LooksOne />
      </ToolbarButton>
      <ToolbarButton>
        <LooksTwo />
      </ToolbarButton>
      <ToolbarButton>
        <Looks3 />
      </ToolbarButton>
    </ToolbarBlock>
    <ToolbarBlock>
      <ToolbarButton>
        <FormatListNumbered />
      </ToolbarButton>
      <ToolbarButton>
        <FormatListBulleted />
      </ToolbarButton>
    </ToolbarBlock>
    <ToolbarBlock>
      <ToolbarButton>
        <Code />
      </ToolbarButton>
      <ToolbarButton>
        <FormatQuote />
      </ToolbarButton>
      <ToolbarButton>
        <InsertLink />
      </ToolbarButton>
      <ToolbarButton>
        <InsertPhoto />
      </ToolbarButton>
      <ToolbarButton>
        <GridOn />
      </ToolbarButton>
      <ToolbarButton>
        <InsertEmoticon />
      </ToolbarButton>
    </ToolbarBlock>
  </ToolbarContainer>
);

export default EditorToolbar;
