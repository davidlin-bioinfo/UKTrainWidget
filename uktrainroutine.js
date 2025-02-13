// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-brown; icon-glyph: magic;
const TRANSPORT_API_KEY = ""; // TransportAPI 密钥
const APP_ID = ""; // 应用 ID

const route_1_label = "BHM ➔ Uni";
const route_1_origin = "BHM";
const route_1_destination = "UNI";

const route_2_label = "Uni ➔ BHM";
const route_2_origin = "UNI";
const route_2_destination = "BHM";

const routes = [
  {
    label: route_1_label,
    origin_destination: [route_1_origin, route_1_destination],
  },
  {
    label: route_2_label,
    origin_destination: [route_2_origin, route_2_destination],
  },
];

// 统一配色方案
const colors = {
  widgetBg: Color.dynamic(
    new Color("#EAECED"), // 浅色模式背景
    new Color("#22262C")  // 深色模式背景
  ),
  cellBackgroundColor: Color.dynamic(
    new Color("#D0D2D4"), // 浅色模式单元格背景
    new Color("#3C4044")  // 深色模式单元格背景
  ),
  update: Color.dynamic(
    new Color("#676767"), // 浅色模式更新时间颜色
    new Color("#A1A1A6")  // 深色模式更新时间颜色
  ),
  labelTextColor: Color.dynamic(
    new Color("#00204F"), // 浅色模式标题文本颜色
    new Color("#FFF")     // 深色模式标题文本颜色
  ),
  cellTextColor: Color.dynamic(
    new Color("#212121"), // 浅色模式单元格文本颜色
    new Color("#FFFFFF")  // 深色模式单元格文本颜色
  ),
};

const widget = new ListWidget();
widget.backgroundColor = colors.widgetBg;

function composeTransportApiRequestUrl(origin, destination) {
  return [
    `https://transportapi.com/v3/uk/train/station/${encodeURIComponent(origin)}/live.json`,
    `?app_id=${APP_ID}`,
    `&app_key=${TRANSPORT_API_KEY}`,
    `&calling_at=${encodeURIComponent(destination)}`,
    `&train_status=passenger`,
  ].join("");
}

async function getStopData(origin, destination) {
  const transportApiRequestUrl = composeTransportApiRequestUrl(origin, destination);
  const transportApiRequest = new Request(transportApiRequestUrl);
  const data = await transportApiRequest.loadJSON();
  console.log(`Data for ${origin} -> ${destination}:`, JSON.stringify(data));
  return data;
}

function getStopTimes(stopData) {
  const departures = stopData.departures.all;

  return departures
    .map((departure) => {
      let expectedDepartureTime = departure.expected_departure_time;
      const status = departure.status || "N/A";
      const platform = departure.platform || "N/A";

      // 如果时间有效，去掉前导零
      if (expectedDepartureTime) {
        const [hour, minute] = expectedDepartureTime.split(":");
        expectedDepartureTime = `${parseInt(hour, 10)}:${minute}`;
      }

      if (expectedDepartureTime) {
        return {
          time: expectedDepartureTime,
          status: status,
          platform: platform,
        };
      }
      return null; // 跳过无效数据
    })
    .filter((item) => item !== null); // 移除无效数据
}

function createRouteScheduleStack(stopTimes, label) {
  let title = widget.addText(label);
  title.textColor = colors.labelTextColor;
  title.font = Font.boldSystemFont(14);

  let row = widget.addStack();
  row.setPadding(4, 0, 0, 0);

  stopTimes.forEach(({ time, status, platform }, idx) => {
    let cell = row.addStack();

    // 动态设置颜色：交替颜色或基于 status 的颜色
    let backgroundColor;
    if (status === "On Time") {
      backgroundColor = new Color("#A5D6A7"); // 绿色
    } else if (status === "Delayed") {
      backgroundColor = new Color("#FFCDD2"); // 红色
    } else {
      // 交替颜色作为默认
      backgroundColor = idx % 2 === 0 
        ? new Color("#A5D6A7")  // 浅绿色
        : new Color("#FFCDD2"); // 浅红色
    }

    cell.backgroundColor = backgroundColor;
    cell.setPadding(4, 4, 4, 4);
    cell.cornerRadius = 6;

    // 设置文字
    let cellText = cell.addText(`${time}|${platform}`);
    cellText.font = Font.mediumSystemFont(10);
    cellText.textColor = colors.cellTextColor;

    // 添加间距
    if (idx < stopTimes.length - 1) {
      row.addSpacer(6);
    }
  });
}

// 加载路线数据
for (let i = 0; i < routes.length; i++) {
  const route = routes[i];
  const [origin, destination] = route.origin_destination;

  const stopData = await getStopData(origin, destination);
  const stopTimes = getStopTimes(stopData);
  createRouteScheduleStack(stopTimes.slice(0, 3), route.label);

  if (i < routes.length - 1) {
    widget.addSpacer(8);
  }
}

// 添加更新时间
let lastUpdatedAt = "Last updated " + new Date().toLocaleTimeString();
const lastUpdatedAtText = widget.addText(lastUpdatedAt);
lastUpdatedAtText.textColor = colors.update;
lastUpdatedAtText.font = Font.lightSystemFont(8);

const now = new Date();
widget.refreshAfterDate = new Date(now.getTime() + 60 * 60 * 1000);
Script.setWidget(widget);
Script.complete();
widget.presentSmall();