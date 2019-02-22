export default (filterName, count, isChecked = false, isDisabled = false) => `<input
  type="radio"
  id="filter__${filterName}"
  class="filter__input visually-hidden"
  name="filter"
  ${isChecked ? ` checked` : ``}
  ${isDisabled ? ` disabled` : ``}
/>
<label for="${filterName}" class="filter__label">
${filterName.toUpperCase()} <span class="filter__${filterName}-count">${count}</span></label
>`;
