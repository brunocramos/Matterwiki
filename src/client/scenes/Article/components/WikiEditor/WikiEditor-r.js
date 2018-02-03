import { Editor } from "slate-react";
import { Value } from "slate";

import React from "react";
import { isKeyHotkey } from "is-hotkey";

import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Code,
  LooksOne,
  LooksTwo,
  FormatQuote,
  FormatListNumbered,
  FormatListBulleted
} from "material-ui-icons";

import initialValue from "./value.json";

/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = "paragraph";

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isKeyHotkey("mod+b");
const isItalicHotkey = isKeyHotkey("mod+i");
const isUnderlinedHotkey = isKeyHotkey("mod+u");
const isCodeHotkey = isKeyHotkey("mod+`");

/**
 * The rich text example.
 *
 * @type {Component}
 */

class WikiEditor extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */
  state = {
    value: Value.fromJSON(initialValue)
  };

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  };

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = type => {
    const { value } = this.state;
    return value.blocks.some(node => node.type === type);
  };

  /**
   * On change, save the new `value`.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value });
  };

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Change} change
   * @return {Change}
   */

  onKeyDown = (event, change) => {
    let mark;

    if (isBoldHotkey(event)) {
      mark = "bold";
    } else if (isItalicHotkey(event)) {
      mark = "italic";
    } else if (isUnderlinedHotkey(event)) {
      mark = "underlined";
    } else if (isCodeHotkey(event)) {
      mark = "code";
    } else {
      return;
    }

    event.preventDefault();
    change.toggleMark(mark);
    return true;
  };

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change().toggleMark(type);
    this.onChange(change);
  };

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change();
    const { document } = value;

    // Handle everything but list buttons.
    if (type !== "bulleted-list" && type !== "numbered-list") {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock("list-item");

      if (isList) {
        change
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else {
        change.setBlock(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock("list-item");
      const isType = value.blocks.some(
        block => !!document.getClosest(block.key, parent => parent.type === type)
      );

      if (isList && isType) {
        change
          .setBlock(DEFAULT_NODE)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else if (isList) {
        change
          .unwrapBlock(type === "bulleted-list" ? "numbered-list" : "bulleted-list")
          .wrapBlock(type);
      } else {
        change.setBlock("list-item").wrapBlock(type);
      }
    }

    this.onChange(change);
  };

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        {this.renderToolbar()}
        {this.renderEditor()}
      </div>
    );
  }

  /**
   * Render the toolbar.
   *
   * @return {Element}
   */

  renderToolbar = () => (
    <div className="menu toolbar-menu">
      {this.renderMarkButton("bold", FormatBold)}
      {this.renderMarkButton("italic", FormatItalic)}
      {this.renderMarkButton("underlined", FormatUnderlined)}
      {this.renderMarkButton("code", Code)}
      {this.renderBlockButton("heading-one", LooksOne)}
      {this.renderBlockButton("heading-two", LooksTwo)}
      {this.renderBlockButton("block-quote", FormatQuote)}
      {this.renderBlockButton("numbered-list", FormatListNumbered)}
      {this.renderBlockButton("bulleted-list", FormatListBulleted)}
    </div>
  );

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {Component} Icon
   * @return {Element}
   */

  renderMarkButton = (type, Icon) => {
    const isActive = this.hasMark(type);
    const onMouseDown = event => this.onClickMark(event, type);

    return (
      // <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
      <Icon />
      // </span>
    );
  };

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @return {Element}
   */

  renderBlockButton = (type, Icon) => {
    const isActive = this.hasBlock(type);
    const onMouseDown = event => this.onClickBlock(event, type);

    return (
      // <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
      <Icon />
      // </span>
    );
  };

  /**
   * Render the Slate editor.
   *
   * @return {Element}
   */

  renderEditor = () => (
    <div className="editor">
      <Editor
        placeholder="Enter some rich text..."
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
        spellCheck
      />
    </div>
  );

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

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
      default:
        return <div {...attributes}>{children}</div>;
    }
  };

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = props => {
    const { children, mark } = props;
    switch (mark.type) {
      case "bold":
        return <strong>{children}</strong>;
      case "code":
        return <code>{children}</code>;
      case "italic":
        return <em>{children}</em>;
      case "underlined":
        return <u>{children}</u>;
      default:
        return <span>{children}</span>;
    }
  };
}

export default WikiEditor;
