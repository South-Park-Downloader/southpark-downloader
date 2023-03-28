export declare type Arguments = {
  [name: string]: ArgumentDefinition
}

export declare type ArgumentDefinition = {
  description?: string, 
  defaultValue?: any 
}

export declare type Options = {
  [name: string]: BooleanOptionDefinition | ValueOptionDefinition;
}

export declare type ValueOptionDefinition = {
  defaultValue?: any,
  placeholder?: string,
} & OptionDefinition<'value'>;

export declare type BooleanOptionDefinition = OptionDefinition<'boolean'>;

export declare type OptionDefinition<T> = {
  type: T,

  description?: string,
  required?: boolean,
  short?: string,
};