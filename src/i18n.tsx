// Locale engine

import { cloneElement } from "react";

export const create = <T,>(main: string, messages: T) => {
  const dictionary: Record<string, T> = {
    [main]: messages,
  };

  const instance = {
    create(secondary: string, messages: T) {
      dictionary[secondary] = messages;
      return instance;
    },

    get(language: string) {
      return dictionary[language];
    },

    languages() {
      return Object.keys(dictionary);
    },
  };

  return instance;
};

// Template argument

export type Argument = symbol;

export const arg = (key: string): Argument => {
  return Symbol(key);
};

// Template

export type Template = (string | symbol)[];

export const tpl = (template: TemplateStringsArray, ...values: Argument[]): Template => {
  let cursor = 0;

  return template.reduce((output, element) => {
    if (element !== "") {
      output.push(element);
    }

    if (cursor in values) {
      output.push(values[cursor]);
    }

    cursor++;

    return output;
  }, [] as Template);
};

interface MessageProps {
  tpl: Template;
  children: Record<string, (arg: string) => JSX.Element>;
}

export const Message = ({ tpl, children }: MessageProps) => {
  return (
    <>
      {tpl.map((segment) => {
        if (typeof segment === "symbol" && segment.description && segment.description in children) {
          return cloneElement(children[segment.description](segment.description), { key: segment.description });
        }

        return segment;
      })}
    </>
  );
};
