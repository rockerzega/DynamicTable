# React Mobile Table

==================================

Componente mobil para visualizar tabla con caracteristicas básicas de `Ant Design`

- [Instalacion](#instalacion)
- [Props](#props)

## Instalacion

⚠️ React Mobile Table requiere usar `Dayjs`
[Dayjs](https://day.js.org/en/).

### Install via npm

```
$ npm install
```

### Props
| Propiedad | Descripción |
| --------- | ----------- |
| color | Color de la tabla, es opcional si se desea asignar un color en concreto. |
| onChange | Función de callback que se ejecuta cuando cambia la paginación, los filtros o el ordenamiento de la tabla. Recibe como parámetros la información de paginación, los filtros aplicados y el resultado del ordenamiento. |
| columns | Arreglo de objetos que define las columnas de la tabla. |
| dataSource | Arreglo de objetos que contiene los datos a mostrar en la tabla. |
| children | Contenido adicional que se renderiza dentro de la tabla. |
| pagination | Objeto que define la configuración de paginación de la tabla. Contiene las propiedades `current` (página actual), `defaultPageSize` (tamaño de página por defecto) y `total` (total de elementos). |
| isLoading | Indica si la tabla está cargando datos. |
| expandable | Objeto que define la funcionalidad de expansión de filas en la tabla. Contiene las propiedades `rowExpandable` (función que determina si una fila es expandible) y `expandedRowRender` (función que renderiza el contenido expandido de una fila). || Propiedad | Descripción |
| --------- | ----------- |
| color | Color de la tabla. |
| onChange | Función de callback que se ejecuta cuando cambia la paginación, los filtros o el ordenamiento de la tabla. Recibe como parámetros la información de paginación, los filtros aplicados y el resultado del ordenamiento. |
| columns | Arreglo de objetos que define las columnas de la tabla. |
| dataSource | Arreglo de objetos que contiene los datos a mostrar en la tabla. |
| children | Contenido adicional que se renderiza dentro de la tabla. |
| pagination | Objeto que define la configuración de paginación de la tabla. Contiene las propiedades `current` (página actual), `defaultPageSize` (tamaño de página por defecto) y `total` (total de elementos). |
| isLoading | Indica si la tabla está cargando datos. |
| expandable | Objeto que define la funcionalidad de expansión de filas en la tabla. Contiene las propiedades `rowExpandable` (función que determina si una fila es expandible) y `expandedRowRender` (función que renderiza el contenido expandido de una fila). |
