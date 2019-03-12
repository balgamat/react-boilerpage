export interface FunctionsMapType {
  [key: string]: ((...args: any[]) => void) | undefined;
}

export type ActionType = (...args: any[]) => any;
export type PromiseActionType = Promise<ActionType>;
export type DispatchType = (
  action: ActionType | PromiseActionType | ActionType[],
) => undefined;

export type StateType = object;
