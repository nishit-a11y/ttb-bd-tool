import React, { useEffect, useState, useContext } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AppContext from "../components/AppContext";

// import "./App.css";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// const grid = 8;

// const getItemStyle = (isDragging, draggableStyle) => ({
//   userSelect: "none",
//   padding: grid * 2,
//   margin: `0 0 ${grid}px 0`,
//   background: isDragging ? "lightgreen" : "grey",
//   ...draggableStyle,
// });

// const getListStyle = (isDraggingOver) => ({
//   background: isDraggingOver ? "lightblue" : "#ffffff",
//   padding: grid,
//   width: "100%",
// });

const SortableList = ({
  items,
  onSortEnd,
  change_material_cost,
  material_cost_fees,
  local_material_cost,
  setLocal_material_cost,
  setChange_material_cost,
}) => {
  const myContext = useContext(AppContext);
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    // Reorder the local material cost
    const resultMaterialLocalArr = Array.from(local_material_cost);
    const [removedLocal] = resultMaterialLocalArr.splice(
      result.source.index,
      1
    );
    resultMaterialLocalArr.splice(result.destination.index, 0, removedLocal);

    const resultMaterialArr = Array.from(material_cost_fees);
    const [removed] = resultMaterialArr.splice(result.source.index, 1);
    resultMaterialArr.splice(result.destination.index, 0, removed);

    onSortEnd(reorderedItems);
    setLocal_material_cost(resultMaterialLocalArr);
    myContext.setMaterial_cost_fees(resultMaterialArr);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <TableBody {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <>
                    <TableRow
                      key={item.id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TableCell>{item.data.game_name}</TableCell>
                      <TableCell>
                        {!change_material_cost[index] ? (
                          material_cost_fees[index] === "" ? (
                            "0"
                          ) : (
                            material_cost_fees[index]
                          )
                        ) : (
                          <input
                            type="number"
                            class="form-control"
                            id="formGroupExampleInput"
                            value={local_material_cost[index]}
                            onChange={(e) => {
                              setLocal_material_cost((prevState) =>
                                prevState.map((s, i) => {
                                  if (i === index) {
                                    return e.target.value;
                                  }
                                  return s;
                                })
                              );
                            }}
                          ></input>
                        )}
                      </TableCell>
                      <TableCell>
                        {!change_material_cost[index] ? (
                          <img
                            alt=""
                            className="edit-table-icons"
                            onClick={(e) => {
                              setLocal_material_cost((prevState) =>
                                prevState.map((s, i) => {
                                  if (i === index) {
                                    return material_cost_fees[index] === ""
                                      ? "0"
                                      : material_cost_fees[index];
                                  }
                                  return s;
                                })
                              );

                              setChange_material_cost((prevState) =>
                                prevState.map((s, i) => {
                                  if (i === index) {
                                    return true;
                                  }
                                  return s;
                                })
                              );
                            }}
                            src={require("../assets/images/edit.png")}
                            width={20}
                            height={20}
                          ></img>
                        ) : (
                          <div className="edit-table">
                            <img
                              alt=""
                              onClick={(e) => {
                                material_cost_fees[index] =
                                  local_material_cost[index];
                                setChange_material_cost((prevState) =>
                                  prevState.map((s, i) => {
                                    if (i === index) {
                                      return false;
                                    }
                                    return s;
                                  })
                                );
                              }}
                              className="edit-table-icons"
                              src={require("../assets/images/table-tick.png")}
                              width={15}
                              height={15}
                            ></img>
                            <img
                              alt=""
                              onClick={(e) =>
                                setChange_material_cost((prevState) =>
                                  prevState.map((s, i) => {
                                    if (i === index) {
                                      return false;
                                    }
                                    return s;
                                  })
                                )
                              }
                              className="edit-table-icons"
                              src={require("../assets/images/table-cancel.png")}
                              width={15}
                              height={15}
                            ></img>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </TableBody>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SortableList;
