/**
 * 单个输入值，允许 null/undefined 方便链式调用，支持数字自动转换
 */
export type SlashInput = string | number | null | undefined;

/**
 * 支持的输入形式：单值、数组、嵌套数组（支持只读数组）
 */
export type SlashInputs = SlashInput | readonly SlashInput[] | readonly (SlashInput | readonly SlashInput[])[];

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
