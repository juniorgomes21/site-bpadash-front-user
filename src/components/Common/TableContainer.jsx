import React from "react";
import PropTypes from "prop-types";
import DeletePerPaW from "./rules/DeletePerPaW";


function TableContainer({ columns, data, customPageSize, className }) {

  return (
        <>
            <div className="table-responsive react-table">
                <DeletePerPaW />
            </div>
        </>
  )
}

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;
