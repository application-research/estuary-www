import { createBreakpoint } from "react-use";

export enum BreakpointEnum {
  XS = "XS",
  SM = "SM",
  MD = "MD",
  LG = "LG",
  XL = "XL",
  XXL = "XXL",
}

export const useBreakpoint = createBreakpoint({
  XXL: 1920,
  XL: 1600,
  LG: 1200,
  MD: 992,
  SM: 768,
  XS: 0,
}) as () => BreakpointEnum;