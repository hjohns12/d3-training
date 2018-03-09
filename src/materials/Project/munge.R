setwd("C:/Users/hjohnson/Root/Learning/d3-training/src/materials/Project")
library(tidyverse)

regions <- read.csv("data/air_quality.csv") %>%
  select(State, Region)

cleandata <- read.csv("data/rawdata.csv") %>%
  select(YearStart, YearEnd, LocationAbbr, LocationDesc, Data_Value, GeoLocation) %>%
  mutate(YearRange = paste(YearStart, YearEnd, sep = "-"))

write.csv(cleandata, "data/longBikes.csv")

trial <- cleandata[1:2, ]
write.csv(trial, "data/longTrial.csv")

findDiff <- cleandata %>%
  select(LocationAbbr, Data_Value, YearStart) %>%
  spread(YearStart, Data_Value) %>%
  mutate(diff = `2011` - `2006`,
         pchange = (diff/`2006`)*100)

cleandata <- merge(cleandata, findDiff[, c("LocationAbbr", "diff", "pchange")], by = "LocationAbbr", all.x = TRUE)  %>%
  select(-YearStart, -YearEnd) %>%
  spread(YearRange, Data_Value)

withRegions <- merge(cleandata, regions, by.x = "LocationAbbr", by.y = "State") %>%
  rename(range6through10 = `2006-2010`,
         range11through15 = `2011-2015`)

write.csv(withRegions, "data/StateBikeData.csv")
