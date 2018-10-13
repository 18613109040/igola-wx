//timeline 筛选
export const CHANGE_FILTER_MENU = "CHANGE_FILTER_MENU"
export function changeFilterMenu(json){
  return{
    type: CHANGE_FILTER_MENU,
    json
  }
}