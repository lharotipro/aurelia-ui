export const ActionTypeOptions = {
  button: 'button',
  icon: 'icon' 
};
 

export const isNilOrEmpty = (value) =>
  value === undefined ||
  value === null ||
  value.length === 0 ||
  Object.getOwnPropertyNames(value).length === 0;

const cursorPointer = { cursor: "pointer" };
 

export const FiltreType = Object.freeze({
  column: "column",
  table: "table",
});


export const TooltipPosition = Object.freeze({
  Left: "left",
  Right: "right",
  Bottom: "bottom",
  Top: "top",
});
export const ColumnTypes = Object.freeze({
  Text: "text",
  Boolean: "boolean",
  Date: "date",
  Email: "email",
  Enum: "enum",
  Html: "html",
  Icon: "icon",
  Link: "link",
  LinkAction: "linkAction",
});
export const BadgeTypes = Object.freeze({
  primary: "primary",
  secondary: "secondary",
  success: "success",
  danger: "danger",
  warning: "warning",
  info: "info",
  light: "light",
  dark: "dark"
}); 
