export function queryElement<T extends Element>(
  selector: string,
  root: ParentNode = document
): T {
  const element = root.querySelector(selector);

  if (!element) {
    throw new Error(`Required element not found: ${selector}`);
  }

  return element as T;
}

export function queryOptional<T extends Element>(
  selector: string,
  root: ParentNode = document
): T | null {
  return root.querySelector(selector) as T | null;
}

export function setText(selector: string, value: string): void {
  const element = queryOptional<HTMLElement>(selector);

  if (element) {
    element.textContent = value;
  }
}

export function setHtml(selector: string, value: string): void {
  const element = queryOptional<HTMLElement>(selector);

  if (element) {
    element.innerHTML = value;
  }
}

export function setImageSource(selector: string, value: string): void {
  const image = queryOptional<HTMLImageElement>(selector);

  if (image) {
    image.src = value;
  }
}
