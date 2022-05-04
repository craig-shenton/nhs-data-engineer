---
title: "Azure Data Factory Templates"
date: 2021-09-09T00:00:00+00:00
author: Craig Robert Shenton, Mattia Ficarelli
layout: post
permalink: /azure-data-factory-templates/
categories: Data Engineering
tags: [Azure, Data Engineering, Data Factory]
---

### Authors
- Craig Robert Shenton, PhD - Senior Data Engineer, NHS England
- Mattia Ficarelli, PhD - Data Engineer, NHSX

Originally posted on the [NHSX technical gateway](https://nhsx.github.io/AnalyticsUnit/) website.

### Content

Open access and reusable design documentation of pipelines used in the NHSX Analytics Azure Data Factory (ADF) environment.

- [SQL Database Ingestion Pipeline](https://craig-shenton.github.io/nhs-data-engineer/azure-data-factory-templates/#sql-database-ingestion-pipeline)
- [Databricks Ingestion Pipeline](https://craig-shenton.github.io/nhs-data-engineer/azure-data-factory-templates/#databricks-ingestion-pipeline)
- [Excel Sheet Ingestion Pipeline](https://craig-shenton.github.io/nhs-data-engineer/azure-data-factory-templates/#excel-sheet-ingestion-pipeline)
- [Multiple Excel Sheet Ingestion Pipeline](https://craig-shenton.github.io/nhs-data-engineer/azure-data-factory-templates/#multiple-excel-sheet-ingestion-pipeline)
- [Web URL Data Ingestion Pipeline](https://craig-shenton.github.io/nhs-data-engineer/azure-data-factory-templates/#web-url-data-ingestion-pipeline)
- [Azure Function App Ingestion Pipeline](https://craig-shenton.github.io/nhs-data-engineer/azure-data-factory-templates/#azure-function-app-ingestion-pipeline)
- [SharePoint Ingestion Pipeline](https://craig-shenton.github.io/nhs-data-engineer/azure-data-factory-templates/#sharepoint-ingestion-pipeline)
- [Databricks Processing Pipeline](https://craig-shenton.github.io/nhs-data-engineer/azure-data-factory-templates/#databricks-processing-pipeline)
- [Azure Function App Processing Pipeline](https://craig-shenton.github.io/nhs-data-engineer/azure-data-factory-templates/#azure-function-app-processing-pipeline)
- [Multiple Azure Function Apps Processing Pipeline](https://craig-shenton.github.io/nhs-data-engineer/azure-data-factory-templates/#multiple-azure-function-apps-processing-pipeline)
- [Copy File Processing Pipeline](https://craig-shenton.github.io/nhs-data-engineer/azure-data-factory-templates/#copy-file-processing-pipeline)
- [SQL Table Staging Pipeline](https://craig-shenton.github.io/nhs-data-engineer/azure-data-factory-templates/#sql-table-staging-pipeline)
- [Multiple SQL Table Staging Pipeline](https://craig-shenton.github.io/nhs-data-engineer/azure-data-factory-templates/#multiple-sql-table-staging-pipeline)

SQL Database Ingestion Pipeline
-------------------------------

### Metadata

{% highlight python %}
# -------------------------------------------------------------------------
# Copyright (c) 2021 NHS England and NHS Improvement. All rights reserved.
# Licensed under the MIT License. See license.txt in the project root for
# license information.
# -------------------------------------------------------------------------

"""
FILE:           ingestion_sql.json
DESCRIPTION:
                Pipeline to ingest raw data to Azure Datalake blob storage
                from a SQL database.

CONTRIBUTORS:   Craig Shenton, Mattia Ficarelli
CONTACT:        data@nhsx.nhs.uk
CREATED:        20 Sept 2021
VERSION:        0.0.1
"""
{% endhighlight %}

### Description

![Data ingestion from a SQL database]({{site.repo}}/blob/main/assets/images/pipeline_temps/sql-ingest.png?raw=true){:class="img-responsive"}

*Figure 1: Data ingestion from a SQL database*

Pipeline to ingest raw data to Azure Datalake blob storage from a SQL
database.

> 1.  Looks up the `.json` configuration file for this pipeline
> 2.  Source:
>     a.  Sets the source database owner (dbo)
>     b.  Sets the source table
>     c.  Sets the SQL query
> 3.  Sink:
>     a.  Sets the file system
>     b.  Sets the sink path
>     c.  Sets the sink file
> 4.  Copy activity copies the data returned from the SQL query as
>     either a `.csv` file or a `.parquet` file.
> 5.  If the copy activity fails, the error notification logic app API
>     will notify the specified email address of the error

### Pipeline Configuration

{% highlight json %}
{
  "pipeline": {
    "name": "ingestion_sql",
    "folder": "templates/ingestion/sql",
    "adl_file_system": "file_system",
    "raw": {
      "source_dbo": "dbo",
      "source_table": "table_1",
      "source_query": "SELECT * FROM dbo.table_1 ORDER BY Date DESC",
      "sink_path": "raw/path/to/data",
      "sink_file": "table_1.parquet"
    }
}
{% endhighlight %}

### Data Factory Configuration

Download the Azure Data Factory json configuration file to use this
template in your own data pipelines.

[sql-ingestion.json](https://raw.githubusercontent.com/nhsx/au-data-engineering/main/config-files/adf-templates/sql-ingestion.json)

Databricks Ingestion Pipeline
-----------------------------

### Metadata

{% highlight python %}
# -------------------------------------------------------------------------
# Copyright (c) 2021 NHS England and NHS Improvement. All rights reserved.
# Licensed under the MIT License. See license.txt in the project root for
# license information.
# -------------------------------------------------------------------------

"""
FILE:           ingestion_databricks.json
DESCRIPTION:
                Pipeline to ingest raw data to Azure Datalake blob storage
                using a databricks notebook.

CONTRIBUTORS:   Craig Shenton, Mattia Ficarelli
CONTACT:        data@nhsx.nhs.uk
CREATED:        20 Sept 2021
VERSION:        0.0.1
"""
{% endhighlight %}

### Description

![Data ingestion using a databricks notebook]({{site.repo}}/blob/main/assets/images/pipeline_temps/databricks/databricks.png?raw=true){:class="img-responsive"}

*Figure 2: Data ingestion using a databricks notebook*

Pipeline to ingest raw data to Azure Datalake blob storage using a
databricks notebook.

> 1.  Lookup the `.json` configuration file for this pipeline.
> 2.  Set the databricks notebook path.
> 3.  Databricks notebook activity runs the databricks notebook
>     specified using an ephemeral job cluster.
> 4.  If the databricks notebook activity fails, the error notification
>     logic app API will notify the specified email address of the
>     error.

Within the databricks notebook, using Azure Databricks Functions, data
can be saved to blob storage as either a `.csv` file or a `.parquet`
file.

### Pipeline Configuration

{% highlight json %}
{
  "pipeline": {
    "name": "ingestion_databricks",
    "folder": "templates/ingestion/databricks",
    "adl_file_system": "file_system",
    "raw": {
      "databricks_notebook": "/path/to/databricks/notebook"
    }
}
{% endhighlight %}

### Data Factory Configuration

Download the Azure Data Factory `.json` configuration file to use this
template in your own data pipelines.

[databricks-ingestion.json](https://raw.githubusercontent.com/nhsx/au-data-engineering/main/config-files/adf-templates/databricks-ingestion.json)

Excel Sheet Ingestion Pipeline
------------------------------

### Metadata

{% highlight python %}
# -------------------------------------------------------------------------
# Copyright (c) 2021 NHS England and NHS Improvement. All rights reserved.
# Licensed under the MIT License. See license.txt in the project root for
# license information.
# -------------------------------------------------------------------------

"""
FILE:           ingestion_excel_sheet.json
DESCRIPTION:
                Pipeline to ingest a specified excel file sheet, as a .csv
                file, to Azure Datalake blob storage.

CONTRIBUTORS:   Craig Shenton, Mattia Ficarelli
CONTACT:        data@nhsx.nhs.uk
CREATED:        20 Sept 2021
VERSION:        0.0.1
"""
{% endhighlight %}

### Description

![Data ingestion of an excel file sheet]({{site.repo}}/blob/main/assets/images/pipeline_temps/excel_sheet_ingestion.png?raw=true){:class="img-responsive"}

*Figure 3: Data ingestion of an excel file sheet*

Pipeline to ingest a specified excel file sheet, as a `.csv` file, to
Azure Datalake blob storage.

> 1.  Lookup the `.json` configuration file for this pipeline.
> 2.  Set the Azure Datalake file system.
> 3.  Set the source file path, file name, and excel sheet name.
> 4.  Set the sink file path and file name.
> 5.  Copy activity ingests the excel sheet data to a `.csv` file.
> 6.  If the copy activity fails, the error notification logic app API
>     will notify the specified email address of the error.

### Pipeline Configuration

{% highlight json %}
{
  "pipeline": {
    "name": "ingestion_excel_sheet",
    "folder": "templates/ingestion/excel_sheet",
    "adl_file_system": "file_system",
    "raw": {
      "source_path": "raw/",
      "source_file": "file.xlsx",
      "source_sheet": "table_1",
      "sink_path": "processed/",
      "sink_name": "table_1.csv"
    }
}
{% endhighlight %}

### Data Factory Configuration

Download the Azure Data Factory `.json` configuration file to use this template in your own data pipelines.
[excel-sheet-ingestion.json](https://raw.githubusercontent.com/nhsx/au-data-engineering/main/config-files/adf-templates/excel-sheet-ingestion.json)

#### Note

> Alternatively this a variation of this pipeline can be used to ingest multiple excel file sheets to a set of `.csv` files in Azure Datalake blob storage.

Multiple Excel Sheet Ingestion Pipeline
---------------------------------------

### Metadata

{% highlight python %}
# -------------------------------------------------------------------------
# Copyright (c) 2021 NHS England and NHS Improvement. All rights reserved.
# Licensed under the MIT License. See license.txt in the project root for
# license information.
# -------------------------------------------------------------------------

"""
FILE:           ingestion_multiple_excel_sheets.json
DESCRIPTION:
                Pipeline to ingest multiple specified excel file sheets as .csv files 
                to Azure Datalake blob storage.

CONTRIBUTORS:   Craig Shenton, Mattia Ficarelli
CONTACT:        data@nhsx.nhs.uk
CREATED:        20 Sept 2021
VERSION:        0.0.1
"""
{% endhighlight %}

### Description

![Data ingestion of multiple excel file sheets]({{site.repo}}/blob/main/assets/images/pipeline_temps/multiple_excel_sheet_ingestion.png?raw=true){:class="img-responsive"}

*Figure 4: Data ingestion of multiple excel file sheets*

![ForEach loop activities within pipeline]({{site.repo}}/blob/main/assets/images/pipeline_temps/multiple_excel_sheet_ingestion_2.png?raw=true){:class="img-responsive"}

*Figure 5: ForEach loop activities within pipeline*

Pipeline to ingest multiple specified excel file sheets as `.csv` files
to Azure Datalake blob storage.

> 1.  Looks up the `.json` configuration file for this pipeline.
> 2.  Set the Azure Datalake file system.
> 3.  Set the source path to the folder containing the excel files.
> 4.  Set the sink path.
> 5.  Set an `array` variable containing the list of excel
>     file metadata.
> 6.  ForEach loops over each excel file:
>     a.  Sets the source sheet and sink file.
>     b.  Copy activity ingests the excel sheet data and saves it as a
>         `.csv` file.
>     c.  If the copy activity fails, the error notification logic app
>         API will notify the specified email address of the error.

#### Note

Copy activity has 'File path type' set to wildcard and the file name
regex as `*.xlsx` (excel) (see Figure 6).

![Copy activity wildcard setup]({{site.repo}}/blob/main/assets/images/pipeline_temps/multiple_excel_sheet_ingestion_3.png?raw=true){:class="img-responsive"}

*Figure 6: Copy activity wildcard setup*

### Pipeline Configuration

{% highlight json %}
{
  "pipeline": {
    "name": "ingestion_multiple_excel_sheets",
    "folder": "templates/ingestion/multiple_excel_sheets",
    "adl_file_system": "file_system",
    "raw": {
      "source_path": "ingestion/",
      "sink_path": "raw/path/to/data",
      "sink_path": "processed/"
      "excel":[
    {
      "sink_file": "table_1.csv",
      "source_sheet": "sheet_1"
    },
    {
      "sink_file": "table_2.csv",
      "source_sheet": "sheet_2"
    },
    {
      "sink_file": "table_3.csv",
      "source_sheet": "sheet_3"
    }
  ]
}
{% endhighlight %}

### Data Factory Configuration

Download the Azure Data Factory `.json` configuration file to use this
template in your own data pipelines.

[multiple-excel-sheet-ingestion.json](https://raw.githubusercontent.com/nhsx/au-data-engineering/main/config-files/adf-templates/multiple-excel-sheet-ingestion.json)

Web URL Data Ingestion Pipeline
-------------------------------

### Metadata

{% highlight python %}
# -------------------------------------------------------------------------
# Copyright (c) 2021 NHS England and NHS Improvement. All rights reserved.
# Licensed under the MIT License. See license.txt in the project root for
# license information.
# -------------------------------------------------------------------------

"""
FILE:           ingestion_web_url.json
DESCRIPTION:
                Pipeline to ingest data from a URL as a .csv file to 
                Azure Datalake blob storage.

CONTRIBUTORS:   Craig Shenton, Mattia Ficarelli
CONTACT:        data@nhsx.nhs.uk
CREATED:        20 Sept 2021
VERSION:        0.0.1
"""
{% endhighlight %}

### Description

![Data ingestion from a web URL]({{site.repo}}/blob/main/assets/images/pipeline_temps/web_url_ingestion.png?raw=true){:class="img-responsive"}

*Figure 7: Data ingestion from a web URL*

Pipeline to ingest data from a web URL as a `.csv` file to Azure
Datalake blob storage.

> 1.  Lookup the `.json` configuration file for this pipeline.
> 2.  Set the source URL.
> 3.  Set the file system.
> 4.  Set the sink path.
> 5.  Set the sink file.
> 6.  Copy activity copies the data returned from the URL as a `.csv`
>     file.
> 7.  If the copy activity fails, the error notification logic app API
>     will notify the specified email address of the error.

### Pipeline Configuration

{% highlight json %}
{
  "pipeline": {
    "name": "ingestion_web_url",
    "folder": "templates/ingestion/web_url",
    "adl_file_system": "file_system",
    "raw": {
      "source_url": "https://www.sourcedata.com",
      "sink_path": "raw/path/to/data",
      "sink_file": "table_1.csv"
    }
}
{% endhighlight %}

### Data Factory Configuration

Download the Azure Data Factory `.json` configuration file to use this
template in your own data pipelines.

[web-url-ingestion.json](https://raw.githubusercontent.com/nhsx/au-data-engineering/main/config-files/adf-templates/web-url-ingestion.json)

Azure Function App Ingestion Pipeline
-------------------------------------

### Metadata

{% highlight python %}
# -------------------------------------------------------------------------
# Copyright (c) 2021 NHS England and NHS Improvement. All rights reserved.
# Licensed under the MIT License. See license.txt in the project root for
# license information.
# -------------------------------------------------------------------------

"""
FILE:           ingestion_function_app.json
DESCRIPTION:
                Pipeline to ingest raw data to Azure Datalake blob storage
                using an Azure function app.

CONTRIBUTORS:   Craig Shenton, Mattia Ficarelli
CONTACT:        data@nhsx.nhs.uk
CREATED:        29 Sept 2021
VERSION:        0.0.1
"""
{% endhighlight %}

### Description

![Data ingestion using an azure function app]({{site.repo}}/blob/main/assets/images/pipeline_temps/function_app_ingestion.png?raw=true){:class="img-responsive"}

*Figure 8: Data ingestion using an azure function app*

Pipeline to ingest raw data to Azure Datalake blob storage using an
Azure function app.

> 1.  Lookup the `.json` configuration file for this pipeline.
> 2.  Set the Azure function app.
> 3.  Azure function app activity triggers the specified function app.
> 4.  If the Azure function app activity fails, the error notification
>     logic app API will notify the specified email address of the
>     error.

Within the Azure function app data can be saved to blob storage as
either a `.csv` file or a `.parquet` file.

### Pipeline Configuration

{% highlight json %}
{
  "pipeline": {
    "name": "ingestion_function_app",
    "folder": "templates/ingestion/function_app",
    "adl_file_system": "file_system",
    "raw": {
      "func_name": "azure_func_app"
    }
}
{% endhighlight %}

### Data Factory Configuration

Download the Azure Data Factory `.json` configuration file to use this
template in your own data pipelines.

[function-app-ingestion.json](https://raw.githubusercontent.com/nhsx/au-data-engineering/main/config-files/adf-templates/function-app-ingestion.json)

SharePoint Ingestion Pipeline
-----------------------------

### Metadata

{% highlight python %}
# -------------------------------------------------------------------------
# Copyright (c) 2021 NHS England and NHS Improvement. All rights reserved.
# Licensed under the MIT License. See license.txt in the project root for
# license information.
# -------------------------------------------------------------------------

"""
FILE:           ingestion_sharepoint.json
DESCRIPTION:
                Pipeline to ingest a specified folder and files from Microsoft
                SharePoint to Azure Datalake blob storage.

CONTRIBUTORS:   Craig Shenton, Mattia Ficarelli
CONTACT:        data@nhsx.nhs.uk
CREATED:        29 Sept 2021
VERSION:        0.0.1
"""
{% endhighlight %}

### Description

![Data ingestion from microsoft sharepoint]({{site.repo}}/blob/main/assets/images/pipeline_temps/sharepoint_ingestion.png?raw=true){:class="img-responsive"}

*Figure 9: Data ingestion from microsoft sharepoint*

Pipeline to ingest a specified folder from Microsoft SharePoint to Azure
Datalake blob storage.

> 1.  Lookup the `.json` configuration file for this pipeline.
> 2.  Set the SharePoint file path and SharePoint logic app URL.
> 3.  Call the SharePoint logic app using a webhook that will send back
>     a message once the file transfer is complete.
> 4.  If the logic app fails, the error notification logic app API will
>     notify the specified email address of the error.

### Pipeline Configuration

{% highlight python %}
{
  "pipeline": {
    "name": "ingestion_sharepoint",
    "folder": "templates/ingestion/sharepoint",
    "adl_file_system": "file_system",
    "raw": {
      "source_path": "...sharepoint/...",
      "logic_app_url": "https://...logic.azure.com/..."
    }
}
{% endhighlight %}

### Data Factory Configuration

Download the Azure Data Factory `.json` configuration file to use this
template in your own data pipelines.

[sharepoint-ingestion.json](https://raw.githubusercontent.com/nhsx/au-data-engineering/main/config-files/adf-templates/sharepoint-ingestion.json)

Databricks Processing Pipeline
------------------------------

### Metadata

{% highlight python %}
# -------------------------------------------------------------------------
# Copyright (c) 2021 NHS England and NHS Improvement. All rights reserved.
# Licensed under the MIT License. See license.txt in the project root for
# license information.
# -------------------------------------------------------------------------

"""
FILE:           processing_databricks.json
DESCRIPTION:
                Pipeline to process data from a folder in Azure Datalake 
                blob storage using a databricks notebook.

CONTRIBUTORS:   Craig Shenton, Mattia Ficarelli
CONTACT:        data@nhsx.nhs.uk
CREATED:        23 Sept 2021
VERSION:        0.0.1
"""
{% endhighlight %}

### Description

![Data processing using a Databricks notebook]({{site.repo}}/blob/main/assets/images/pipeline_temps/databricks/databricks.png?raw=true){:class="img-responsive"}

*Figure 10: Data processing using a Databricks notebook*

Pipeline to process data from a folder in Azure Datalake blob storage
using a databricks notebook

> 1.  Lookup the `.json` configuration file for this pipeline.
> 2.  Set the databricks notebook path.
> 3.  Databricks notebook activity runs the databricks notebook
>     specified using an ephemeral job cluster.
> 4.  If the databricks notebook activity fails, the error notification
>     logic app API will notify the specified email address of the
>     error.

### Pipeline Configuration

{% highlight json %}
{
  "pipeline": {
    "name": "processing_databricks",
    "folder": "templates/processing/databricks",
    "project": {
      "databricks_notebook": "/path/to/databricks/notebook"
    }
}
{% endhighlight %}

### Databricks Orchestration

#### Note

> Alternatively this pipeline can be used to trigger an orchestrator databricks notebook which in turn runs a series of data processing notebooks.

{% highlight json %}
{
  "pipeline": {
    "name": "processing_databricks",
    "folder": "templates/processing/databricks_orchestrator",
    "project": {
      "databricks_orchestrator_notebook": "/path/to/databricks/orchestrator_notebook"
      "databricks":[    
          {
        "sink_path": "path/to/processed/data",
        "sink_file": "file_1.csv",
        "databricks_notebook": "/path/to/databricks/processing_notebook1"
        },    
          {
        "sink_path": "path/to/processed/data",
        "sink_file": "file_2.csv",
        "databricks_notebook": "/path/to/databricks/processing_notebook2"
        },
    }
}
{% endhighlight %}

Python code to sequentially run databricks notebook paths specified in a
`.json` config file from a databricks orchestrator notebook.

{% highlight python %}
#Squentially run datbricks notebooks
for index, item in enumerate(config_JSON['pipeline']['project']['databricks']): 
    notebook = config_JSON['pipeline']['project']['databricks'][index]['databricks_notebook']
    dbutils.notebook.run(notebook, 120)
  except Exception as e:
    print(e)
{% endhighlight %}

### Data Factory Configuration

Download the Azure Data Factory `.json` configuration file to use this
template in your own data pipelines.

[processing-databricks.json](https://raw.githubusercontent.com/nhsx/au-data-engineering/main/config-files/adf-templates/databricks-processing.json)

Azure Function App Processing Pipeline
--------------------------------------

### Metadata

{% highlight python %}
# -------------------------------------------------------------------------
# Copyright (c) 2021 NHS England and NHS Improvement. All rights reserved.
# Licensed under the MIT License. See license.txt in the project root for
# license information.
# -------------------------------------------------------------------------

"""
FILE:           processing_function_app.json
DESCRIPTION:
                Pipeline to process data to time-stamped folder in 
                Azure Datalake blob storage using an Azure function app.

CONTRIBUTORS:   Craig Shenton, Mattia Ficarelli
CONTACT:        data@nhsx.nhs.uk
CREATED:        29 Sept 2021
VERSION:        0.0.1
"""
{% endhighlight %}

### Description

![Data processing using an azure function app]({{site.repo}}/blob/main/assets/images/pipeline_temps/function_app_processing.png?raw=true){:class="img-responsive"}

*Figure 11: Data processing using an azure function app*

#### Note

This pipeline is designed to allow for raw data to be ingested and then
appended onto an existing table with historical data.

Pipeline to process data to time-stamped folder in Azure Datalake blob
storage using an Azure function app.

> 1.  Lookup the `.json` configuration file for this pipeline.
> 2.  Set the source path (of the data to be processed).
> 3.  Set the file system.
> 4.  Set the Azure function app.
> 5.  Use the 'laterFolder' utility to find and save the latest folder
>     in the source path.
> 6.  If the 'laterFolder' utility fails, the error notification logic
>     app API will notify the specified email address of the error.
> 7.  Lookup the latest folder.
> 8.  Set the latest folder.
> 9.  Set the `.json` body for the Azure function app.
> 10. Run the Azure function app activity.
> 11. If the Azure function app activity fails, the error notification
>     logic app API will notify the specified email address of the
>     error.

Within the Azure function app data can be saved to blob storage as
either a `.csv` file or a `.parquet` file.

### Pipeline Configuration

{% highlight json %}
{
  "pipeline": {
    "name": "processing_function_app",
    "folder": "templates/processing/function_app",
    "adl_file_system": "file_system",
    "project": {
      "func_name": "azure_func_app",
      "source_path": "raw/historical/data/source"
    }
}
{% endhighlight %}

### Data Factory Configuration

Download the Azure Data Factory `.json` configuration file to use this
template in your own data pipelines.

[function-app-processing.json](https://raw.githubusercontent.com/nhsx/au-data-engineering/main/config-files/adf-templates/function-app-processing.json)

Multiple Azure Function Apps Processing Pipeline
------------------------------------------------

### Metadata

{% highlight python %}
# -------------------------------------------------------------------------
# Copyright (c) 2021 NHS England and NHS Improvement. All rights reserved.
# Licensed under the MIT License. See license.txt in the project root for
# license information.
# -------------------------------------------------------------------------

"""
FILE:           processing_multiple_function_apps.json
DESCRIPTION:
                Pipeline to process data to time-stamped folders in 
                Azure Datalake blob storage using multiple Azure function apps.

CONTRIBUTORS:   Craig Shenton, Mattia Ficarelli
CONTACT:        data@nhsx.nhs.uk
CREATED:        29 Sept 2021
VERSION:        0.0.1
"""
{% endhighlight %}

### Description

![Data processing using multiple azure function apps]({{site.repo}}/blob/main/assets/images/pipeline_temps/multiple_function_app_processing.png?raw=true){:class="img-responsive"}

*Figure 12: Data processing using multiple azure function apps*

![ForEach loop activities within pipeline]({{site.repo}}/blob/main/assets/images/pipeline_temps/multiple_function_app_processing_2.png?raw=true){:class="img-responsive"}

*Figure 13: ForEach loop activities within pipeline*

#### Note

This pipeline allows for multiple different processed data files to be
generated from the same data source during a pipeline run by using
multiple function apps running sequentially.

Pipeline to process data to time-stamped folder in Azure Datalake blob
storage using multiple Azure function apps.

> 1.  Lookup the `.json` configuration file for this pipeline.
> 2.  Set the source path (of the data to be processed).
> 3.  Set the file system.
> 4.  Set the Azure function app.
> 5.  Use the 'laterFolder' utility to find and save the latest folder
>     in the source path.
> 6.  If the 'laterFolder' utility fails, the error notification logic
>     app API will notify the specified email address of the error.
> 7.  Lookup the latest folder.
> 8.  Set the latest folder.
> 9.  Set the `.json` body for the Azure function app.
> 10. Set an `array` variable containing the list of Azure function apps
>     to be run.
> 11. ForEach loops over each azure function:
>
> > a.  Runs the Azure function app activity.
> > b.  If the Azure function app activity fails, the error notification
> >     logic app API will notify the specified email address of the
> >     error.

Within the Azure function app data can be saved to blob storage as
either a `.csv` file or a `.parquet` file.

### Pipeline Configuration

{% highlight json %}
{
  "pipeline": {
    "name": "processing_function_app",
    "folder": "templates/processing/function_app",
    "adl_file_system": "file_system",
    "project": {
      "functions": [
        {"func_name": "azure_func_app_1"},
        {"func_name": "azure_func_app_2"},
        {"func_name": "azure_func_app_3"}
            ],
      "source_path": "raw/historical/data/source"
    }
}
{% endhighlight %}

### Data Factory Configuration

Download the Azure Data Factory `.json` configuration file to use this
template in your own data pipelines.

[multiple-function-app-processing.json](https://raw.githubusercontent.com/nhsx/au-data-engineering/main/config-files/adf-templates/multiple-function-app-processing.json)

Copy File Processing Pipeline
-----------------------------

### Metadata

{% highlight python %}
# -------------------------------------------------------------------------
# Copyright (c) 2021 NHS England and NHS Improvement. All rights reserved.
# Licensed under the MIT License. See license.txt in the project root for
# license information.
# -------------------------------------------------------------------------

"""
FILE:           processing_csv_file.json
DESCRIPTION:
                Pipeline to copy a .csv file in a time-stamped folder 
                between directories in Azure Datalake blob storage.

CONTRIBUTORS:   Craig Shenton, Mattia Ficarelli
CONTACT:        data@nhsx.nhs.uk
CREATED:        29 Sept 2021
VERSION:        0.0.1
"""
{% endhighlight %}

### Description

![Copying a .csv file between Azure Datalake directories]({{site.repo}}/blob/main/assets/images/pipeline_temps/csv_file_processing.png?raw=true){:class="img-responsive"}

*Figure 14: Copying a `.csv` file between Azure Datalake
directories*

Pipeline to copy a `.csv` file in a time-stamped folder between
directories in Azure Datalake blob storage.

> 1.  Lookup the `.json` configuration file for this pipeline.
> 2.  Set the Azure Datalake file system
> 3.  Set the source path and source file name.
> 4.  Set the sink path and sink file name.
> 5.  Use the 'laterFolder' utility to find and save the latest folder
>     in the source path.
> 6.  If the 'laterFolder' utility fails, the error notification logic
>     app API will notify the specified email address of the error.
> 7.  Lookup the latest folder.
> 8.  Set the latest folder.
> 9.  Copy activity copies the `.csv` file between the Datalake
>     directories.
> 10. If the copy activity fails, the error notification logic app API
>     will notify the specified email address of the error.

### Pipeline Configuration

{% highlight json %}
{
  "pipeline": {
    "name": "processing_csv_file",
    "folder": "templates/processing/csv_file",
    "adl_file_system": "file_system",
    "project": {
      "source_path": "raw/",
      "source_name": "file.csv",
      "sink_path": "proc/",
      "sink_name": "file_copy.csv"
    }
}
{% endhighlight %}

### Data Factory Configuration

Download the Azure Data Factory `.json` configuration file to use this
template in your own data pipelines.

[csv-file-processing.json](https://raw.githubusercontent.com/nhsx/au-data-engineering/main/config-files/adf-templates/csv-file-processing.json)

SQL Table Staging Pipeline
--------------------------

### Metadata

{% highlight python %}
# -------------------------------------------------------------------------
# Copyright (c) 2021 NHS England and NHS Improvement. All rights reserved.
# Licensed under the MIT License. See license.txt in the project root for
# license information.
# -------------------------------------------------------------------------

"""
FILE:           staging_sql_database.json
DESCRIPTION:
                Pipeline to stage data from a time-stamped folder in 
                Azure Datalake blob storage to a table in an Azure SQL database. 

CONTRIBUTORS:   Craig Shenton, Mattia Ficarelli
CONTACT:        data@nhsx.nhs.uk
CREATED:        29 Sept 2021
VERSION:        0.0.1
"""
{% endhighlight %}

### Description

![Data staging to a table in an Azure SQL database]({{site.repo}}/blob/main/assets/images/pipeline_temps/sql_database_staging.png?raw=true){:class="img-responsive"}

*Figure 15: Data staging to a table in an Azure SQL database*

Pipeline to stage data (`.csv` file) from a time-stamped folder in Azure
Datalake blob storage to a table in an Azure SQL database.

> 1.  Lookup the `.json` configuration file for this pipeline.
> 2.  Set the source path (of data to be staged).
> 3.  Set the source file.
> 4.  Set the file system.
> 5.  Set the sink table (target table in the SQL database).
> 6.  Set the stored procedure (truncates data in the target table in
>     the SQL database).
> 7.  Run the stored procedure activity. The stored procedure also sets
>     the data type of each column in the database table.
> 8.  Use the 'laterFolder' utility to find and save the latest folder
>     in the source path.
> 9.  If the 'laterFolder' utility fails, the error notification logic
>     app API will notify the specified email address of the error.
> 10. Lookup the latest folder.
> 11. Set the latest folder.
> 12. Run the copy activity which stages data from a `.csv` file in
>     Azure Datalake blob storage to an empty table in an Azure SQL
>     database.
> 13. If the Azure copy activity fails, the error notification logic app
>     API will notify the specified email address of the error.

### Pipeline Configuration

{% highlight json %}
{
  "pipeline": {
    "name": "staging_sql_database",
    "folder": "templates/staging/sql_database",
    "adl_file_system": "file_system",
    "staging": {
        "stored_procedure":"[dbo].[sql_stored_procedure_table_1]",
        "source_path":"proc/projects/path/to/processed/data/",
        "source_file":"table_1.csv",
        "sink_table":"sql_table_1"
    }
}
{% endhighlight %}

### Data Factory Configuration

Download the Azure Data Factory `.json` configuration file to use this
template in your own data pipelines.

[sql-database-staging.json](https://raw.githubusercontent.com/nhsx/au-data-engineering/main/config-files/adf-templates/staging-sql-database.json)

Multiple SQL Table Staging Pipeline
-----------------------------------

### Metadata

{% highlight python %}
# -------------------------------------------------------------------------
# Copyright (c) 2021 NHS England and NHS Improvement. All rights reserved.
# Licensed under the MIT License. See license.txt in the project root for
# license information.
# -------------------------------------------------------------------------

"""
FILE:           multiple_tables_staging_sql_database.json
DESCRIPTION:
                Pipeline to stage data from a time-stamped folders in 
                Azure Datalake blob storage to multiple tables in an Azure SQL database. 

CONTRIBUTORS:   Craig Shenton, Mattia Ficarelli
CONTACT:        data@nhsx.nhs.uk
CREATED:        29 Sept 2021
VERSION:        0.0.1
"""
{% endhighlight %}

### Description

![Data staging to multiple tables in an Azure SQL database]({{site.repo}}/blob/main/assets/images/pipeline_temps/multiple_table_sql_database_staging.png?raw=true){:class="img-responsive"}

*Figure 16: Data staging to multiple tables in an Azure SQL database*

![ForEach loop activities within pipeline]({{site.repo}}/blob/main/assets/images/pipeline_temps/multiple_table_sql_database_staging_2.png?raw=true){:class="img-responsive"}

*Figure 17: ForEach loop activities within pipeline*

Pipeline to stage data (`.csv` files) from a time-stamped folders in
Azure Datalake blob storage to multiple tables in an Azure SQL database.

> 1.  Lookup the `.json` configuration file for this pipeline.
> 2.  Set the file system.
> 3.  Set an `array` variable containing the list of stored procedures
>     and tables to which processed data is to be staged.
> 4.  For each element in the list the ForEach loop:
>     a.  Sets the source path (of data to be staged).
>     b.  Sets the source file.
>     c.  Uses the 'laterFolder' utility to find and save the latest
>         folder in the source path.
>     d.  Lookups the latest folder.
>     e.  Sets the latest folder.
>     f.  Sets the sink table (target table in the SQL database).
>     g.  Sets the stored procedure (truncates data in the target table
>         in the SQL database).
>     h.  Runs the stored procedure activity. The stored procedure also
>         sets the data type of each column in the database table.
>     i.  Runs the copy activity which stages data from a `.csv` file in
>         azure Datalake blob storage to an empty table in an Azure SQL
>         database.
>     j.  If the Azure copy activity fails, the error notification logic
>         app API will notify the specified email address of the error.

### Pipeline Configuration

{% highlight json %}
{
  "pipeline": {
    "name": "multiple_tables_staging_sql_database",
    "folder": "templates/staging/multiple_tables_sql_database",
    "adl_file_system": "file_system",
    "staging": [
          {
            "stored_procedure":"[dbo].[sql_stored_procedure_table_1]",
            "source_path":"proc/projects/path/to/processed/data/",
            "source_file":"table_1.csv",
            "sink_table":"sql_table_1"
          },
          {
            "stored_procedure":"[dbo].[sql_stored_procedure_table_2]",
            "source_path":"proc/projects/path/to/processed/data2/",
            "source_file":"table_2.csv",
            "sink_table":"sql_table_2"
          },
          {
            "stored_procedure":"[dbo].[sql_stored_procedure_table_3]",
            "source_path":"proc/projects/path/to/processed/data3/",
            "source_file":"table_3.csv",
            "sink_table":"sql_table_3"
          }
      ]
}
{% endhighlight %}

### Data Factory Configuration

Download the Azure Data Factory `.json` configuration file to use this
template in your own data pipelines.

[multiple-tables-sql-database-staging.json](https://raw.githubusercontent.com/nhsx/au-data-engineering/main/config-files/adf-templates/multiple-tables-sql-database-staging.json)



