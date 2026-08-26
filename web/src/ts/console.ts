import { LogMessage } from "../../pkg/wasm/core_engine";
import { get_element } from "./common";

const grid_element = get_element<HTMLDivElement>('#console-grid');
const inner_container = get_element<HTMLDivElement>('#console');
const header = get_element<HTMLDivElement>('#console-header');
const handle = get_element<HTMLDivElement>('#console-drag-handle');
const scroll = get_element<HTMLDivElement>('#console-scroll');
const spacer = get_element<HTMLDivElement>('#console-spacer');
const content = get_element<HTMLDivElement>('#console-content');

let log_messages: LogMessage[] = [];

export const clear_console = () => {
  log_messages = [];
  spacer.style.height = '0';
  content.replaceChildren();
}

const create_log_element = (msg: LogMessage): HTMLSpanElement => {
  const log = document.createElement('div');
  log.classList.add('log');

  const sys = document.createElement('span');
  sys.classList.add('log-system');
  sys.innerText = `${msg.system} =>`;
  log.appendChild(sys);

  const usr = document.createElement('span');
  usr.classList.add('log-user');
  usr.innerText = msg.log;
  log.appendChild(usr);
  return log;
}

const show_log = (msg: LogMessage) => {
  const log = create_log_element(msg);
  content.appendChild(log);
}

const get_log_height = (): number => {
  const log = create_log_element({ system: "Test", log: "Even more testing" });
  log.style.visibility = 'hidden';
  log.style.position = 'absolute';
  content.appendChild(log);
  const log_h = log.offsetHeight;
  content.removeChild(log);
  if (log_h == 0) {
    return 1;
    // prevent infinity problems caused by division by 0
  }
  return log_h;
}

const max_logs_showable = (): number => {
  let log_h = get_log_height();
  if (log_h === 0) {
    log_h = 1;
  }

  const container_h = inner_container.offsetHeight;
  return (container_h / log_h);
}

const set_spacer = () => {
  const log_h = get_log_height();
  const scroll_h = log_messages.length * log_h + log_h + 'px';
  spacer.style.height = String(scroll_h);
}

const get_view_index = () => {
  const log_h = get_log_height();
  const scroll_pos = scroll.scrollTop;
  if (scroll_pos == 0) {
    return 0;
  }

  return scroll_pos / log_h;
}

const console_size_observer = new ResizeObserver(() => {
  render_logs();
});

const render_logs = () => {
  const index = Math.floor(get_view_index());
  content.replaceChildren();
  const max = max_logs_showable();
  const num_logs = log_messages.length;
  for (let i = 0; i < max; i++) {
    const log_i = i + index;
    if (log_i >= num_logs) {
      return;
    }
    show_log(log_messages[log_i] as LogMessage);
  }
}

export const add_logs = (logs: LogMessage[]) => {
  logs.forEach(log => {
    log_messages.push(log);
  });
  set_spacer();
  render_logs();
}

let wrapper_h = 0;
const set_wrapper_height = (h: number): { clamped: boolean } => {
  let clamped = false;
  wrapper_h = h;
  const grid_height = grid_element.getBoundingClientRect().height;
  if (wrapper_h < grid_height) {
    wrapper_h = grid_height;
    clamped = true;
  }

  grid_element.style.setProperty('--console-height', wrapper_h + 'px');
  return { clamped };
}

const create_drag_handler = (start_y: number): ((event: PointerEvent) => void) => {
  let last_y = start_y;
  const func = (event: PointerEvent) => {
    const new_y = event.screenY;
    const delta_y = last_y - new_y;
    last_y = new_y;
    const clamped = set_wrapper_height(wrapper_h + delta_y).clamped;
    if (clamped) {
      // cancel drag
      const up_event = new PointerEvent('pointerup', {});
      header.dispatchEvent(up_event);
    }
  };
  return func;
}

export const init_console = () => {
  // set inital size matching grid (auto clamps)
  set_wrapper_height(0);

  // render on resize
  console_size_observer.observe(inner_container);

  // render on scrolling
  scroll.addEventListener('scroll', () => {
    render_logs();
  });

  // pass scrolling through
  content.addEventListener('wheel', (event) => {
    event.preventDefault();
    scroll.scrollTop = scroll.scrollTop + event.deltaY;
  });

  // handle dragging motion for resizing
  header.addEventListener('pointerdown', (event) => {
    header.setPointerCapture(event.pointerId);
    handle.classList.add('dragging');
    document.body.classList.add('dragging');

    const drag_handler = create_drag_handler(event.screenY);
    header.addEventListener('pointermove', drag_handler);
    header.addEventListener('pointerup', () => {
      header.removeEventListener('pointermove', drag_handler);
      header.releasePointerCapture(event.pointerId);
      handle.classList.remove('dragging');
      document.body.classList.remove('dragging');
    })
  });
}
