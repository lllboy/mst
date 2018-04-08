/*
 * @Author: Hank
 * @Date: 2017-06-22 12:37:54
 * @Last Modified by: Hank
 * @Last Modified time: 2017-08-19 18:27:00
 */

export function echartPieColor(data) {
  let num = data.length;
  let colors = [];
  switch (num) {
    case 1:
      colors = [
        "rgba(178,210,52,1)"
      ]
      break;
    case 2:
      colors = [
        "rgba(178,210,52,1)",
        "rgba(30,200,243,1)"
      ]
      break;
    case 3:
      colors = [
        "rgba(178,210,52,1)",
        "rgba(139,197,63,1)",
        "rgba(30,200,243,1)"
      ]
      break;
    case 4:
      colors = [
        "rgba(178,210,52,1)",
        "rgba(139,197,63,1)",
        "rgba(101,175,69,1)",
        "rgba(30,200,243,1)"
      ]
      break;
    case 5:
      colors = [
        "rgba(178,210,52,1)",
        "rgba(139,197,63,1)",
        "rgba(101,175,69,1)",
        "rgba(30,200,243,1)",
        "rgba(255,207,0,1)",
      ]
      break;
    case 6:
      colors = [
        "rgba(178,210,52,1)",
        "rgba(139,197,63,1)",
        "rgba(101,175,69,1)",
        "rgba(30,200,243,1)",
        "rgba(0,175,230,1)",
        "rgba(255,207,0,1)",
      ]
      break;
    case 7:
      colors = [
        "rgba(178,210,52,1)",
        "rgba(139,197,63,1)",
        "rgba(101,175,69,1)",
        "rgba(30,200,243,1)",
        "rgba(0,175,230,1)",
        "rgba(255,207,0,1)",
        "rgba(250,180,20,1)"
      ]
      break;
    case 8:
      colors = [
        "rgba(178,210,52,1)",
        "rgba(139,197,63,1)",
        "rgba(101,175,69,1)",
        "rgba(30,200,243,1)",
        "rgba(0,175,230,1)",
        "rgba(245,155,155,1)",
        "rgba(255,207,0,1)",
        "rgba(250,180,20,1)"
      ]
      break;
    case 9:
      colors = [
        "rgba(178,210,52,1)",
        "rgba(139,197,63,1)",
        "rgba(101,175,69,1)",
        "rgba(30,200,243,1)",
        "rgba(0,175,230,1)",
        "rgba(245,155,155,1)",
        "rgba(243,130,134,1)",
        "rgba(255,207,0,1)",
        "rgba(250,180,20,1)"
      ]
      break;
    case 10:
      colors = [
        "rgba(178,210,52,1)",
        "rgba(139,197,63,1)",
        "rgba(101,175,69,1)",
        "rgba(30,200,243,1)",
        "rgba(0,175,230,1)",
        "rgba(0,150,210,1)",
        "rgba(245,155,155,1)",
        "rgba(243,130,134,1)",
        "rgba(255,207,0,1)",
        "rgba(250,180,20,1)"
      ]
      break;
  }
  return colors;
}

export function formatLegend(data) {
  if (data && data.length) {
    const filterData = data.filter(data => {
      data.icon = 'circle'
      data.textStyle = {
        fontSize: 14
      }
      return data.name
    })
    return filterData;
  }
}
export function formatScatterLegend(data) {
  if (data && data.length) {
    const filterData = data.filter(data => {
      data.icon = 'circle'
      delete data.value
      return data.name
    })
    return filterData;
  }
}

export function sum(data) {
  let sum = 0;
  if (data !== null) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].value !== undefined) {
        sum += data[i].value;
      } else {
        sum += data[i]
      }
    }
    return sum;
  }
}

export function echartValue(data) {
  if (data !== null) {
    const filterData = data.filter(d => {
      return d.value;
    })
    return filterData;
  }
}

export function echartName(data) {
  const names = [];
  data.forEach((v, i, data) => {
    names.push(data[i].name);
  })
  return names;
}

export function upperCase(value) {
  return (value) ? value.toUpperCase() : '';
}

export function formatNum(num) {
  return (num.toFixed(0) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

export function formatPercent(num) {
  return (num * 100).toFixed(2) + "%";
}

export function isInteger(obj) {
  return typeof obj === 'number' && obj % 1 === 0
}

export function echartNum(num) {
  return (num.toFixed(0) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

export function echartPercent(num, data) {
  if (data !== 0) {
    return (num / data * 100).toFixed(2) + '%'
  } else {
    return 0
  }
};

export function createRandomItemStyle(d) {
  d = d || Math.floor((Math.random() * 20) + 1);
  let colors = [
    "rgba(178,210,52,1)",
    "rgba(139,197,63,1)",
    "rgba(101,175,69,1)",
    "rgba(30,200,243,1)",
    "rgba(0,175,230,1)",
    "rgba(0,150,210,1)",
    "rgba(245,155,155,1)",
    "rgba(243,130,134,1)",
    "rgba(255,207,0,1)",
    "rgba(250,180,20,1)"
  ];
  if (d > colors.length) {
    d = 0;
  }
  return {
    normal: {
      color: colors[d]
    }
  };
}

export function maxNum() {
  return Math.max.apply(null, arguments)
}

export function formatBarData(data) {
  if (data && data.length) {
    data.forEach((item, index, self) => {
      self[index].type = 'bar';
      self[index].barWidth = 25;
      self[index].stack = '总量';
    })
    return data;
  }
}

export function formatLineData(data) {
  if (data && data.length) {
    data.forEach((item, index, self) => {
      self[index].type = 'line';
      self[index].barWidth = 25;
      self[index].stack = '总量';
      self[index].areaStyle = false;
    })
    return data;
  }
}

export function formatAreaData(data) {
  if (data && data.length) {
    data.forEach((item, index, self) => {
      self[index].type = 'line';
      self[index].barWidth = 25;
      self[index].stack = '总量';
      self[index].areaStyle = {
        normal: {
          opacity: 0.5,
        }
      }
    })
    return data;
  }
}

export function formatScatter(data) {
  const color = [
    "rgba(178,210,52,1)",
    "rgba(139,197,63,1)",
    "rgba(101,175,69,1)",
    "rgba(30,200,243,1)",
    "rgba(0,175,230,1)",
    "rgba(0,150,210,1)",
    "rgba(245,155,155,1)",
    "rgba(243,130,134,1)",
    "rgba(255,207,0,1)",
    "rgba(250,180,20,1)"
  ]
  data.forEach((item, index, self) => {
    item.itemStyle = {
      normal: {
        color: color[index]
      }
    };
    item.data = [item.value]
    item.type = 'scatter';
    item.symbolSize = 40;
  })
  return data
}
export function compare(prop) {
  return function (obj1, obj2) {
    var val1 = obj1[prop];
    var val2 = obj2[prop];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
      return 1;
    } else if (val1 > val2) {
      return -1;
    } else {
      return 0;
    }
  }
}
