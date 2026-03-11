import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

export function clickButton(de: DebugElement, selector:string, log = false) {
  const btn = de.query(By.css(selector));
  if (log) {
    console.log(btn?.nativeElement?.innerHTML ?? `button with selector ${selector} not found`);
  }
  btn.nativeElement.click();
}

export function getTableContent(de:DebugElement, selector:string) {
  return de.queryAll(By.css(selector)).map(el => el?.nativeElement?.textContent ?? "not found");
}
