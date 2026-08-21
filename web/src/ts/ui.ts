import { get_element } from "./common";
import { init_console } from "./console";

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

const init_error = () => {
  const error = get_element<HTMLDivElement>('#error-popup');
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof Node && !error.contains(event.target as Node)) {
      error?.classList.remove('shown');
    }
  });
}

export const show_error = (msg: string) => {
  const error = get_element<HTMLDivElement>('#error-popup');
  error.innerText = msg;
  error.classList.add('shown');
}

export const init_ui = () => {
  init_selects();
  init_error();
  init_console();
};
