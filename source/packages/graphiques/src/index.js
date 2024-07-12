import { PLATFORM } from "aurelia-pal";
import { ToastService } from "./core/toast-service/toast-service";
import { LockService } from "./core/lock-service/lock-service";
import { DialogService } from "./core/dialog-service/dialog-service";
import { DialogController }  from "./core/dialog-service/dialog-controller"
import { AutoCompleteController }  from "./elements/auto-complete/auto-complete-controller"
function configure(config) {
  config.globalResources([
    // Table
    PLATFORM.moduleName("./elements/table/generic-table"),
    PLATFORM.moduleName("./elements/table/generic-column"),

    PLATFORM.moduleName("./elements/table/type-column/date-column"),
    PLATFORM.moduleName("./elements/table/type-column/email-column"),
    PLATFORM.moduleName("./elements/table/type-column/html-column"),
    PLATFORM.moduleName("./elements/table/type-column/link-column"),
    PLATFORM.moduleName("./elements/table/type-column/linkAction-column"),
    PLATFORM.moduleName("./elements/table/type-column/text-column"),
    PLATFORM.moduleName("./elements/table/type-column/boolean-column"),
    PLATFORM.moduleName("./elements/table/type-column/enum-column"),
    PLATFORM.moduleName("./elements/table/type-column/icon-column"),

    PLATFORM.moduleName("./elements/table/filter/filter"),
    PLATFORM.moduleName(
      "./elements/table/filter/filter-type-column/date-filter"
    ),
    PLATFORM.moduleName(
      "./elements/table/filter/filter-type-column/text-filter"
    ),
    PLATFORM.moduleName(
      "./elements/table/filter/filter-type-column/enum-filter"
    ),
    PLATFORM.moduleName(
      "./elements/table/filter/filter-type-column/boolean-filter"
    ),
    PLATFORM.moduleName(
      "./elements/table/filter/filter-type-column/email-filter"
    ),
    PLATFORM.moduleName(
      "./elements/table/filter/filter-type-column/link-filter"
    ),
    PLATFORM.moduleName(
      "./elements/table/filter/filter-type-column/linkAction-filter"
    ),

    // BREADCRUMBS
    PLATFORM.moduleName("./elements/breadcrumbs/breadcrumbs"),

    // AUTO-COMPLETE
    PLATFORM.moduleName("./elements/auto-complete/auto-complete"),
    PLATFORM.moduleName("./elements/auto-complete/badges-auto-complete"),
    PLATFORM.moduleName("./elements/auto-complete/address-auto-complete"),

    // ENVIRONMENT-RIBBON
    PLATFORM.moduleName("./elements/environment-ribbon/environment-ribbon"),

    // LOADING-INDICATOR
    PLATFORM.moduleName("./elements/loading-indicator/loading-indicator"),

    // LOCK
    PLATFORM.moduleName("./elements/lock/lock"),

    // DATEPICKER
    PLATFORM.moduleName("./elements/input-datepicker/input-datepicker"),

    // SELECT
    PLATFORM.moduleName("./elements/select/simple-select"),
    PLATFORM.moduleName("./elements/select/filterable-select"),
    PLATFORM.moduleName("./elements/select/badges-select"),

    // VALUE-CONVERTERS
    PLATFORM.moduleName("./value-converters/date-format"),
    PLATFORM.moduleName("./value-converters/instruction-filter"),
  ]);
}

export { configure, LockService, ToastService, DialogService, DialogController, AutoCompleteController };
