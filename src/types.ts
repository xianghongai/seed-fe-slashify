/**
 * 单个输入值，允许 null/undefined 方便链式调用
 */
export type SlashInput = string | null | undefined;

/**
 * 支持的输入形式：单值、数组、嵌套数组
 */
export type SlashInputs = SlashInput | SlashInput[] | (SlashInput | SlashInput[])[];

/**
 * 配置选项
 */
export interface SlashOptions {
  /**
   * 分隔符，默认 '/'
   * @default '/'
   */
  separator?: string;
}
