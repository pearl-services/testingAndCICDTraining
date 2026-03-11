import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

export function clickButton(de: DebugElement, selector:string, log = false) {
  const btn = de.query(By.css(selector));
  if (log) {
    console.log(btn?.nativeElement?.innerHTML ?? `button with selector ${selector} not found`);
  }
  btn.nativeElement.click();
}

export function getRowDescription(de: DebugElement, index: number, log = false) {
  const row = de.query(By.css(`tbody tr:nth-child(${index}) td.description-cell`));
  if (log) {
    console.log(row?.nativeElement?.innerHTML ?? `row with index ${index} not found`);
  }
  return row?.nativeElement?.textContent ?? null;
}

export function getTableContent(de:DebugElement, selector:string) {
  return de.queryAll(By.css(selector)).map(el => el?.nativeElement?.textContent ?? "not found");
}
