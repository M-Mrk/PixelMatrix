import { get_element } from "./common";
import { init_console } from "./console";
import { init_mobile } from "./mobile";

/* INFO: Select */
const init_selects = () => {
  document.querySelectorAll(".tui-select").forEach(select => {
    const trigger = select.querySelector('.tui-select-trigger');
    const dropdown = select.querySelector('.tui-select-dropdown');
    const options = dropdown?.querySelectorAll('.tui-select-option');
    if (!options) {
      throw new Error("Could not find options for select");
    }

    // Toggle dropdown when trigger is clicked
    trigger?.addEventListener('click', () => {
      dropdown?.classList.toggle('open');
    });

    // Close dropdown when clicked elsewhere
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof Node && !select.contains(event.target as Node)) {
        dropdown?.classList.remove('open');
      }
    });

    // Option select logic
    dropdown?.addEventListener('click', (event) => {
      const selected = Array.from(options).find(opt => event.target === opt);
      if (!selected) {
        return;
      }

      options?.forEach(element => {
        element.classList.remove("selected");
      });
      selected.classList.add("selected");

      const new_value = selected.getAttribute("data-value");
      if (!new_value) {
        console.error("Newly selected option does not have data-value set");
        return;
      }
      select.setAttribute("data-selected", new_value);

      dropdown.classList.remove('open');
    });
  });
}

export const get_select_value = (id: string) => {
  const select = get_element(id);
  const val = select.getAttribute("data-selected");
  if (!val) {
    throw new Error("select has no data-selected set");
  }
  return val;
}

export const set_select_value = (id: string, value: string) => {
  const select = get_element(id);
  const dropdown = select.querySelector('.tui-select-dropdown');
  const options = dropdown?.querySelectorAll('.tui-select-option');
  if (!options) {
    throw new Error("Could not find options for select");
  }

  select.setAttribute("data-selected", value);
  const selected_opt = Array.from(options).find(opt => value === opt.getAttribute("data-value"));
  if (!selected_opt) {
    throw new Error("Could not find newly selected option");
  }

  options?.forEach(element => {
    element.classList.remove("selected");
  });
  selected_opt.classList.add("selected");
}

/* INFO: Error Popup */
const error_pop = get_element<HTMLDivElement>('#error-pop');
const error_pop_content = get_element<HTMLDivElement>('#error-pop-content');
const init_error = () => {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof Node && !error_pop.contains(event.target as Node)) {
      hide_error();
    }
  });
}

export const show_error = (msg: string) => {
  error_pop_content.innerText = msg;
  error_pop.classList.add('shown');
}

export const hide_error = () => {
  error_pop.classList.remove('shown');
}

/* INFO: Help box */
const help_box = get_element<HTMLDivElement>('#help-box');
const help_close = get_element<HTMLDivElement>('#help-close-btn');
const help_content = get_element('#help-content');
const help_show_delay = 2000;
const help_hide_delay = 1500;
const hide_help = () => {
  help_box.classList.remove('shown');
}

const show_help = (text: string) => {
  help_content.innerText = text;
  help_box.classList.add('shown');
}

const on_help_element = (element: HTMLElement, help: string) => {
  setTimeout(() => {
    if (!element.matches(':hover')) {
      return;
    }
    show_help(help);

    let handling_leave = false;
    const leave_handler: (() => void) = () => {
      if (handling_leave) {
        return;
      }
      handling_leave = true;

      setTimeout(() => {
        handling_leave = false;
        if (element.matches(':hover') || help_box.matches(':hover')) {
          // cursor still above help related element
          return;
        }

        element.removeEventListener('mouseleave', leave_handler);
        help_box.removeEventListener('mouseleave', leave_handler);
        hide_help();
      }, help_hide_delay);
    }
    element.addEventListener('mouseleave', leave_handler);
    help_box.addEventListener('mouseleave', leave_handler);
  }, help_show_delay);
};

const init_help = () => {
  help_close.addEventListener('click', hide_help);

  document.addEventListener('mouseover', (event) => {
    const target = event.target;
    if (!target || !(target instanceof HTMLElement)) {
      console.debug("dropping because not an HTML Element");
      return;
    }
    let help;
    help = target.getAttribute('data-help');
    if (!help) {
      help = target.parentElement?.getAttribute('data-help'); // used for label elements
      if (!help) {
        return;
      }
    }

    on_help_element(target, help);
  });
};


export const init_ui = () => {
  init_selects();
  init_error();
  init_help();

  // seperate files
  init_console();
  init_mobile();
};
