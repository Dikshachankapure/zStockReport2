sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"jquery.sap.global",
	"sap/viz/ui5/data/FlattenedDataset",
	'sap/viz/ui5/format/ChartFormatter',
	"stock/zstockreport/jsondata/CustomerFormat",
	'sap/viz/ui5/api/env/Format',
	"stock/zstockreport/jsondata/InitPage",
], function (Controller, MessageBox, JSONModel, History, Filter, FilterOperator, global, FlattenedDataset, ChartFormatter, CustomerFormat,
	Format, InitPage) {
	"use strict";

	return Controller.extend("stock.zstockreport.controller.material", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf stock.zstockreport.view.material
		 */
		onInit: function () {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("material").attachPatternMatched(this.onEditMatched, this);

			var oModel = this.getOwnerComponent().getModel("CompanyDataSet");
			this.getView().setModel(oModel, "oModelCompany");

			var oModelQuantity = this.getOwnerComponent().getModel("QuantitySet");
			this.getView().setModel(oModelQuantity, "oModelQty");

			var oModelChart = this.getOwnerComponent().getModel("ChartDataSet");
			this.getView().setModel(oModelChart);

		},
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		Gotopage2: function () {
			this.getRouter().navTo("Storage", {}, true);

		},

		onEditMatched: function (oEvent) {
			var oParameters = oEvent.getParameters();

			if (oParameters.arguments.Type == "TypeA") {
				var oModelData = this.getOwnerComponent().getModel("CompanyDataSet"); //get the data from model 
				this.getView().setModel(oModelData); //set the data to model

				var oModel = this.getView().getModel();

				var storageLoc = this.getView().byId("objectHeader");

				var Amount = this.getView().byId("objectHeader");

				var that = this;

				var otableQTY = this.getView().byId("qtytable");
				otableQTY.setVisible(false);
				var otable = this.getView().byId("table");
				otable.setVisible(true);

				var oPanelChartAmount = this.getView().byId("settingsPanel");
				oPanelChartAmount.setVisible(true);

				var oPanelChartQty = this.getView().byId("settingsPanelQTY");
				oPanelChartQty.setVisible(false);

				that.onPressChartByAmount();

				if (oParameters.arguments.StorageLoc !== "" || oParameters.arguments.StorageLoc !== null) {
					this.StorageLoc = oParameters.arguments.StorageLoc;
					if (oModel.getData().CompanyData.length > 0) {
						for (var i = 0; i < oModel.getData().CompanyData.length; i++) {
							if (oModel.getData().CompanyData[i].StorageLoc.toString() === this.StorageLoc) {

								storageLoc.setTitle(this.StorageLoc);
								Amount.setNumber(oModel.getData().CompanyData[i].JAN);

								return false;
							}

						}
					}

				}
			} else {
				var oModelData = this.getOwnerComponent().getModel("QuantitySet"); //get the data from model 
				this.getView().setModel(oModelData); //set the data to model

				var oModel = this.getView().getModel();

				var storageLoc = this.getView().byId("objectHeader");

				var Amount = this.getView().byId("objectHeader");

				var that = this;

				var otable = this.getView().byId("table");
				otable.setVisible(false);

				var otableQTY = this.getView().byId("qtytable");
				otableQTY.setVisible(true);

				var oPanelChartAmount = this.getView().byId("settingsPanel");
				oPanelChartAmount.setVisible(false);

				var oPanelChartQty = this.getView().byId("settingsPanelQTY");
				oPanelChartQty.setVisible(true);

				that.onPressChartByQty();

				if (oParameters.arguments.StorageLoc !== "" || oParameters.arguments.StorageLoc !== null) {
					this.StorageLoc = oParameters.arguments.StorageLoc;
					if (oModel.getData().Quantity.length > 0) {
						for (var i = 0; i < oModel.getData().Quantity.length; i++) {
							if (oModel.getData().Quantity[i].StorageLoc.toString() === this.StorageLoc) {

								storageLoc.setTitle(this.StorageLoc);
								Amount.setNumber(oModel.getData().Quantity[i].JAN);

								return false;
							}

						}
					}

				}
			}
		},
		onPressChartByAmount: function () {
			Format.numericFormatter(ChartFormatter.getInstance());
			var formatPattern = ChartFormatter.DefaultPattern;
			var oModelChart = this.getOwnerComponent().getModel("ChartDataSet");
			this.getView().setModel(oModelChart);

			var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
			oVizFrame.setVizProperties({
				plotArea: {
					dataLabel: {
						formatString: formatPattern.SHORTFLOAT_MFD2,
						visible: true
					}
				},
				valueAxis: {
					label: {
						formatString: formatPattern.SHORTFLOAT
					},
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				},
				title: {
					visible: true,
					text: 'Stock Report by Amount'
				}
			});

			var oPopOver = this.getView().byId("idPopOver");
			oPopOver.connect(oVizFrame.getVizUid());
			oPopOver.setFormatString(formatPattern.STANDARDFLOAT);

			//	InitPageUtil.initPageSettings(this.getView());
		},

		onPressChartByQty: function () {

			Format.numericFormatter(ChartFormatter.getInstance());
			var formatPattern = ChartFormatter.DefaultPattern;
			var oModelChart = this.getOwnerComponent().getModel("ChartDataSet");
			this.getView().setModel(oModelChart);

			var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrameQty");
			oVizFrame.setVizProperties({
				plotArea: {
					dataLabel: {
						formatString: formatPattern.SHORTFLOAT_MFD2,
						visible: true
					}
				},
				valueAxis: {
					label: {
						formatString: formatPattern.SHORTFLOAT
					},
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				},
				title: {
					visible: true,
					text: 'Stock Report by Quantity'
				}
			});

			var oPopOver = this.getView().byId("idPopOverQty");
			oPopOver.connect(oVizFrame.getVizUid());
			oPopOver.setFormatString(formatPattern.STANDARDFLOAT);

			//	InitPageUtil.initPageSettings(this.getView());
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf stock.zstockreport.view.material
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf stock.zstockreport.view.material
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf stock.zstockreport.view.material
		 */
		//	onExit: function() {
		//
		//	}

	});

});