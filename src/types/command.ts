declare type Arguments = {
  [name: string]: ArgumentDefinition
}

declare type ArgumentDefinition = {
  description?: string, 
  defaultValue?: any 
}

declare type Options = {
  [name: string]: OptionDefinition
}

declare type OptionDefinition = { 
  description?: string,
  defaultValue?: any,
  placeholder?: string,
  required?: boolean,
  short?: string,
  type: 'boolean' | 'value'
};