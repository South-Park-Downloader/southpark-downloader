declare type ArgumentProperties = {
  description?: string, 
  defaultValue?: any 
}

declare type Argument = {
  name: string,
} & ArgumentProperties;

declare type Arguments = { 
  [name: string]: ArgumentProperties
};

declare type OptionProperties = { 
  description?: string, 
  defaultValue?: any 
};

declare type Option = {
  name: string,
} & OptionProperties;

declare type Options = { 
  [name: string]: OptionProperties
}
