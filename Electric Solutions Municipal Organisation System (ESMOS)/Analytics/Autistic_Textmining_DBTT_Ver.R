library("udpipe")
library("readxl")
library("ggplot2")

file <- "C:/Users/brand/Downloads/DBTT_40_5_Star_Reviews.xlsx"
df <- read_excel(file)
print(df)
print(head(df))

reviews <- df$Review

print(reviews)

model <- udpipe_download_model(language = "english")
udmodel_english <- udpipe_load_model(file = 'C:/Users/brand/Documents/english-ewt-ud-2.5-191206.udpipe')
s <- udpipe_annotate(udmodel_english, reviews)
x <- data.frame(s)
print(x)

library(lattice)
stats <- txt_freq(x$upos)
stats$key <- factor(stats$key, levels = rev(stats$key))
barchart(key ~ freq, data = stats, col = "yellow", 
         main = "UPOS (Universal Parts of Speech)\n frequency of occurrence", 
         xlab = "Freq")

## NOUNS
stats <- subset(x, upos %in% c("NOUN")) 
stats <- txt_freq(stats$token)
stats$key <- factor(stats$key, levels = rev(stats$key))
barchart(key ~ freq, data = head(stats, 20), col = "cadetblue", 
         main = "Most occurring nouns", xlab = "Freq")

## ADJECTIVES
stats <- subset(x, upos %in% c("ADJ")) 
stats <- txt_freq(stats$token)
stats$key <- factor(stats$key, levels = rev(stats$key))
barchart(key ~ freq, data = head(stats, 20), col = "purple", 
         main = "Most occurring adjectives", xlab = "Freq")

## VERBS
stats <- subset(x, upos %in% c("VERB")) 
stats <- txt_freq(stats$token)
stats$key <- factor(stats$key, levels = rev(stats$key))
barchart(key ~ freq, data = head(stats, 20), col = "gold", 
         main = "Most occurring Verbs", xlab = "Freq")

## Using RAKE
## Rapid automatic keyword extraction (machine learning)
stats <- keywords_rake(x = x, term = "lemma", group = "doc_id", 
                       relevant = x$upos %in% c("NOUN", "ADJ"))
stats$key <- factor(stats$keyword, levels = rev(stats$keyword))
barchart(key ~ rake, data = head(stats, 20), col = "red", 
         main = "Keywords identified by RAKE", 
         xlab = "Rake")

#Check x$upos
#head(data.frame(token = x$token, upos = x$upos, phrase = x$phrase_tag), 20)

## Using a sequence of POS tags (noun phrases / verb phrases)
# Temp comment phrase tag
# x$phrase_tag <- as_phrasemachine(x$upos, type = "upos")

# This feeds the appropriate vectors that phrase machine is looking for
# Generate group key per sentence
x$group <- paste(x$doc_id, x$sentence_id, sep = "_")

# Generate phrase tags per sentence using lapply
phrase_tags <- lapply(split(x$upos, x$group), as_phrasemachine, type = "upos")

# Flatten it back and align with token rows
x$phrase_tag <- unlist(phrase_tags)[x$group]

stats <- keywords_phrases(x = x$phrase_tag, term = tolower(x$token), 
                          pattern = "(A|N)+", 
                          is_regex = TRUE, detailed = FALSE)
stats <- subset(stats, ngram > 1 & freq > 3)
stats$key <- factor(stats$keyword, levels = rev(stats$keyword))
barchart(key ~ freq, data = head(stats, 20), col = "magenta", 
         main = "Keywords - simple noun phrases", xlab = "Frequency")