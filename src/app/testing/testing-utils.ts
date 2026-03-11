import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

export function clickButton(de: DebugElement, selector:string) {
  const btn = de.query(By.css(selector));
  btn.nativeElement.click();
}

export function getRowDescription(de: DebugElement, index: number) {
  const row = de.query(By.css(`tbody tr:nth-child(${index}) .description-cell`));
  return row?.nativeElement?.textContent ?? null;
}
