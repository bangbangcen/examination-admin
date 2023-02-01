import type { Directive } from "vue";

export const columnWidth: Directive = {
  beforeMount: (el, _, vnode) => {
    const sum = _.value.reduce((pre: number, cur: number) => pre + cur);
    _.value = _.value.map((num: number) => num / sum);
    el.querySelectorAll("colgroup").forEach((colgroup: HTMLElement) => {
      colgroup.remove();
    });
    const trs: HTMLElement[] = el.querySelectorAll("tr");
    trs[0].querySelectorAll("th").forEach((th: HTMLElement, i) => {
      th.style.width = `${_.value[i]}%`;
    });
    trs[1].querySelectorAll("td").forEach((td: HTMLElement, i) => {
      td.style.width = `${_.value[i]}%`;
    });
  },
};
