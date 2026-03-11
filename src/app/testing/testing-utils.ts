import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

export function clickButton(de: DebugElement, selector:string, log = false) {
  const btn = de.query(By.css(selector));
  if (log) {
    console.log(btn.nativeElement.innerHTML);
  } 
  btn.nativeElement.click();
}

export function getRowDescription(de: DebugElement, index: number, log = false) {
  const row = de.query(By.css(`tbody tr:nth-child(${index}) .description-cell`));
  if (log) {
    console.log(row.nativeElement.innerHTML);
  }
  return row?.nativeElement?.textContent ?? null;
}

