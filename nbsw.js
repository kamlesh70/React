importScripts("https://cdn.jsdelivr.net/pouchdb/5.3.1/pouchdb.min.js");
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.1.1/workbox-sw.js"
);
importScripts("/nb-new/service-worker.js");

self.addEventListener("install", function (event) {
  return event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = [
    "nobroker-api",
    "nobroker-css",
    "nobroker-js",
    "nobroker-font",
    "nobroker-api-listings",
    "nobroker-api-plans",
    "nobroker-api-shortlists",
    "nobroker-api-testimonials",
    "nobroker-api-insights",
    "nobroker-external-js",
    "nobroker-assets",
  ];

  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (
    event.request.cache === "only-if-cached" &&
    event.request.mode !== "same-origin"
  )
    return;
  event.respondWith(
    caches.match(event.request, { ignoreVary: true }).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.__precacheFiles = [
  "https://assets.nobroker.in/mobile/dist/styles/main.f42f1754.css",
  "https://assets.nobroker.in/mobile/dist/styles/vendorMain.eddc46d1.css",
  "https://assets.nobroker.in/mobile/dist/scripts/index-bundle.299f5b32.js",
  "https://assets.nobroker.in/mobile/dist/scripts/node-static.9e2b4518.js",
  "https://assets.nobroker.in/mobile/dist/scripts/external/firebase.js",
];
workbox.precaching.precacheAndRoute(self.__precacheFiles, {});

function getEndpoint() {
  return self.registration.pushManager
    .getSubscription()
    .then(function (subscription) {
      if (subscription) {
        return subscription.endpoint;
      }

      throw new Error("User not subscribed");
    });
}

self.addEventListener("push", function (event) {
  var data = event.data.json();
  if (data.payload_type === "NOBROKER") {
    handleNbPush(event);
  } else {
    handleMoePush(event);
  }
});

/* Old Notification Click Event Listner Keeping it for future referrence */
// self.addEventListener('notificationclick', function(event) {
//   // console.log('Notification click: tag', event.notification.tag);
//   // Android doesn't close the notification when you click it
//   // See http://crbug.com/463146
//   event.notification.close();

//   // if(event.action === 'view') {
//     // var url = 'https://www.nobroker.in/tenant/plans';
//     // Check if there's already a tab open with this URL.
//     // If yes: focus on the tab.
//     // If no: open a tab with the URL.
//     event.waitUntil(
//       clients.matchAll({
//         type: 'window'
//       })
//       .then(function(windowClients) {
//         // console.log('WindowClients', windowClients);
//         for (var i = 0; i < windowClients.length; i++) {
//           var client = windowClients[i];
//           // console.log('WindowClient', client);
//           if (client.url === event.notification.data.url && 'focus' in client) {
//             return client.focus();
//           }
//         }
//         if (clients.openWindow) {
//           return clients.openWindow(event.notification.data.url);
//         }
//       })
//     );
//   // }
// });

// **
// * moengage - web - sdk - serviceworker v{ { VERSION } }
// * (c) MoEngage Inc.http://moengage.com
// **
var moeVar = {};
var base_domain = "https://websdk.moengage.com";
var sendDataToServerURL = base_domain;
var getDataFromServerURL = base_domain + "/get/webpush/payload";
var moeDB = new PouchDB("moe_database", {
  auto_compaction: true,
});
var campaignID;

function constructGet(url, params) {
  url = url + "?";
  for (var key in params) {
    url += key + "=" + params[key] + "&";
  }
  return url;
}

function track_event(eventName, attrs, flag) {
  attrs = typeof attrs !== "undefined" ? attrs : {};
  if (
    typeof eventName != "string" ||
    typeof attrs != "object" ||
    typeof eventName == ""
  ) {
    debug_mode &&
      alert(
        "User attributes(key) needs to be string and (value) = string/int/float/boolean. The type you gave is " +
          typeof eventName
      );
    return;
  }
  moeDB.get("moe_variables").then(function (get_data) {
    var post_data = {
      e: eventName,
      a: attrs,
    };
    if (flag) post_data["f"] = 1;
    else post_data["f"] = 0;

    var url_cons = sendDataToServerURL + "/v2/report/add";
    var now = new Date();

    var utc_timestamp = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    );

    get_data.uid.data["device_ts"] = Number(utc_timestamp);
    self.registration.pushManager
      .getSubscription()
      .then(function (subscription) {
        var subscriptionId = splitEndPointSubscription(subscription);
        if (subscriptionId) {
          get_data.uid.data["push_id"] = subscriptionId;
        } else {
          delete get_data.uid.data["push_id"];
        }
        delete get_data.uid.data["os_platform"];
        var url = constructGet(url_cons, get_data.uid.data);
        fetch(url, {
          method: "POST",
          body: JSON.stringify(post_data),
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (result) {})
          .catch(function (error) {});
      });
  });
}

function splitEndPointSubscription(subscriptionDetails) {
  var endpointURL = "https://android.googleapis.com/gcm/send/",
    endpoint = subscriptionDetails.endpoint,
    subscriptionId;
  if (endpoint.indexOf(endpointURL) === 0) {
    return (subscriptionId = endpoint.replace(endpointURL, ""));
  }
  return subscriptionDetails.subscriptionId;
}

function showNotification(
  title,
  body,
  icon,
  tag,
  data,
  requireInteraction,
  actions,
  image
) {
  if (requireInteraction == undefined) {
    requireInteraction = false;
  }

  var notificationOptions = {
    body: body,
    icon: icon,
    tag: tag.tag,
    data: data,
    requireInteraction: requireInteraction,
    actions: actions,
    image: image,
  };

  return self.registration.showNotification(title, notificationOptions);
}

function showNotificationForError(title, body) {
  var notificationOptions = {
    body: body,
    requireInteraction: false,
  };

  return self.registration
    .showNotification(title, notificationOptions)
    .then(function () {
      setTimeout(closeNotifications, 100);
    });
}

function closeNotifications() {
  self.registration.getNotifications().then(function (notifications) {
    for (var i = 0; i < notifications.length; ++i) {
      notifications[i].close();
    }
  });
}

self.addEventListener("install", function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", function (evt) {
  moeDB.get("moe_variables", function (err, doc) {
    if (err) {
      moeDB.put(
        {
          _id: "moe_variables",
          uid: evt.data,
        },
        function callback(err, result) {
          if (!err) {
          } else {
          }
        }
      );
    } else {
      moeDB.put(
        {
          _id: "moe_variables",
          _rev: doc._rev,
          uid: evt.data,
        },
        function (err, response) {
          if (err) {
            return;
          }
        }
      );
    }
  });
});

self.addEventListener("notificationclick", function (event) {
  console.log(event.notification.data);
  var notificationTitle = event.notification.title;
  var notificationBody = event.notification.body;
  event.notification.close();
  var clickResponsePromise = Promise.resolve();
  if (event.action === "0") {
    if (
      event.notification.data &&
      event.notification.data.actions &&
      event.notification.data.actions instanceof Array &&
      event.notification.data.actions.length > 0 &&
      event.notification.data.actions[0].url
    ) {
      clickResponsePromise = clients.openWindow(
        event.notification.data.actions[0].url
      );
    }
  } else if (event.action === "1") {
    if (
      event.notification.data &&
      event.notification.data.actions &&
      event.notification.data.actions instanceof Array &&
      event.notification.data.actions.length > 1 &&
      event.notification.data.actions[1].url
    ) {
      clickResponsePromise = clients.openWindow(
        event.notification.data.actions[1].url
      );
    }
  } else {
    if (event.notification.data && event.notification.data.url) {
      clickResponsePromise = clients.openWindow(event.notification.data.url);
    }
  }
  var eventTracker = new Promise(function (res, rej) {
    moeDB.get("campaigns_backup").then(
      function (backup) {
        var campaigns = backup.campaigns;
        var i = 0;
        while (i < campaigns.length) {
          if (
            campaigns[i].title == notificationTitle &&
            campaigns[i].message == notificationBody
          ) {
            track_event(
              "c",
              {
                cid: campaigns[i].cid,
              },
              1
            );
            campaigns.splice(i, 1);
            moeDB
              .put({
                _id: "campaigns_backup",
                _rev: backup._rev,
                campaigns: campaigns,
              })
              .then(
                function (data) {
                  //console.log("campaigns_backup UPDATED onclick!!");
                },
                function (err) {
                  //console.log("ERROR UPDATING campaigns_backup onclick",err);
                }
              );
            res();
            break;
          }

          i++;
        }
        res();
      },
      function (err) {
        //console.log("ERROR fetching campaigns_backup onclick",err);
      }
    );
  });

  event.waitUntil(
    moeDB
      .get("moe_variables")
      .then(function (doc) {
        moeVar = doc.uid.data;
        if ("environment" in moeVar && moeVar["environment"] != "") {
          base_domain = "https://" + moeVar["environment"] + ".moengage.com";
          sendDataToServerURL = base_domain;
          getDataFromServerURL = base_domain + "/get/webpush/payload";
        }
        return doc;
      })
      .then(function () {
        return Promise.all([clickResponsePromise, eventTracker]);
      })
  );
});

/* Method to handle the Moengage Push Notification */
function handleMoePush(event) {
  if (!(self.Notification && self.Notification.permission === "granted")) {
    return;
  }
  event.waitUntil(
    moeDB
      .get("moe_variables")
      .then(function (doc) {
        moeVar = doc.uid.data;
        if ("environment" in moeVar && moeVar["environment"] != "") {
          base_domain = "https://" + moeVar["environment"] + ".moengage.com";
          sendDataToServerURL = base_domain;
          getDataFromServerURL = base_domain + "/get/webpush/payload";
        }
        return doc;
      })
      .then(function (data) {
        return self.registration.pushManager.getSubscription();
      })
      .then(function (subscription) {
        var jsonPayload;
        try {
          jsonPayload = event.data.json();
        } catch (e) {
          console.log("moe-no-payload");
        }
        if (jsonPayload) {
          return jsonPayload;
        }
        var subscriptionId = splitEndPointSubscription(subscription);
        var MOE_API_ENDPOINT2 = getDataFromServerURL + "?";
        MOE_API_ENDPOINT2 +=
          "app_id=" +
          moeVar.app_id +
          "&" +
          "unique_id=" +
          moeVar.unique_id +
          "&" +
          "push_id=" +
          subscriptionId;
        return fetch(MOE_API_ENDPOINT2).then(function (response) {
          if (response.status !== 200) {
            // Throw an error so the promise is rejected and catch() is executed
            throw new Error("Invalid status code from API: " + response.status);
          }
          return response.json();
        });
      })
      .then(function (data) {
        if (data.cid) {
          campaignID = data.cid;
          var campaignBackup = {
            cid: data.cid,
            title: data.payload && data.payload.title,
            message: data.payload && data.payload.message,
            actions: data.payload && data.payload.actions,
            image: data.payload && data.payload.image,
          };
          moeDB.get("campaigns_backup").then(
            function (backup) {
              var campaigns = backup.campaigns;
              campaigns.push(campaignBackup);
              moeDB
                .put({
                  _id: "campaigns_backup",
                  _rev: backup._rev,
                  campaigns: campaigns,
                })
                .then(
                  function (data) {
                    //console.log("campaigns_backup UPDATED!!");
                  },
                  function (err) {
                    //console.log("ERROR UPDATING campaigns_backup",err);
                  }
                );
            },
            function (err) {
              if (err.message == "missing" || err.name == "not_found") {
                var temp = [];
                temp.push(campaignBackup);
                moeDB
                  .put({
                    _id: "campaigns_backup",
                    campaigns: temp,
                  })
                  .then(
                    function (data) {
                      //console.log("campaigns_backup CREATED!!");
                    },
                    function (err) {
                      //console.log("ERROR CREATING campaigns_backup",err);
                    }
                  );
              }
            }
          );
        }

        if (
          data.payload == undefined ||
          data.payload.title == undefined ||
          data.payload.message == undefined
        ) {
          track_event(
            "MOE_NO_PAYLOAD_WEB",
            {
              cid: campaignID,
            },
            0
          );
          var title = "Welcome";
          var message = "Something unexpected happened";
          return showNotificationForError(title, message);
        }

        var title = data.payload && data.payload.title;
        var message = data.payload && data.payload.message;
        var icon = data.payload && data.payload.icon;
        var actions = data.payload && data.payload.actions;
        var image = data.payload && data.payload.image;
        var requireInteraction =
          (data.payload && !JSON.parse(data.payload.reqInteract)) || false;
        var notificationFilter = {
          tag: (data && data.cid) || "moe-id",
        };

        var notificationData = {
          url: data.payload && data.payload.urlToOpen,
          actions: actions,
        };

        track_event(
          "i",
          {
            cid: campaignID,
          },
          1
        );

        return showNotification(
          title,
          message,
          icon,
          notificationFilter,
          notificationData,
          requireInteraction,
          actions,
          image
        );
      })
      .catch(function (err) {
        var title = "Welcome";
        var message = "Something unexpected happened";
        //throw "oops";
        return showNotificationForError(title, message);
      })
  );
}

/* Method to handle the NBPush Notification */
function handleNbPush(event) {
  var data = event.data.json();
  data.actions = [{ action: "view", title: "View" }];

  if (data && data.clickURL && data.clickURL == "null") {
    return false;
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.description,
      icon: data.imageURL,
      actions: data.actions,
      requireInteraction: true,
      data: {
        url: data.clickURL,
      },
    })
  );
}
